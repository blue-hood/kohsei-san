import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PublishIcon from '@material-ui/icons/Publish';
import ShareIcon from '@material-ui/icons/Share';
import Alert from '@material-ui/lab/Alert';
import score from 'common/score';
import type { LintWorkerMessage } from '../lintWorker';
import type { Memo, MemosAction } from '../useMemo';
import { TextContainer } from './TextContainer';

const lintingTimeoutLimitMS = 10000;
const scoreAverage = 0.003685109284;
const scoreVariance = 0.00001274531341;

const EditContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(2)}px;
  `}
`;

const Edit: React.FunctionComponent<{
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchIsLintingHeavy: React.Dispatch<boolean>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isLinting: boolean;
  lintWorker: Worker;
  memo: Memo;
}> = ({
  dispatchIsLinting,
  dispatchIsLintingHeavy,
  dispatchMemos,
  isLinting,
  lintWorker,
  memo,
}) => {
  const [deviation, setDeviation] = useState<number>();
  const [isTextContainerFocused, dispatchIsTextContainerFocused] = useState(false);
  const [negaposiScore, setNegaposiScore] = useState<number>();

  useEffect(() => {
    if (!lintWorker || memo.result) {
      return;
    }

    lintWorker.postMessage(memo.text);

    const lintingTimeoutID = setTimeout(() => dispatchIsLintingHeavy(true), lintingTimeoutLimitMS);

    dispatchIsLinting(true);
    dispatchIsLintingHeavy(false);

    let isUnmounted = false;

    (async () => {
      const { analyzeNegaposi } = await import(/* webpackChunkName: "negaposi" */ 'negaposi');

      if (!isUnmounted) {
        setNegaposiScore(analyzeNegaposi({ text: memo.text }));
      }
    })();

    return () => {
      isUnmounted = true;

      clearTimeout(lintingTimeoutID);

      dispatchIsLinting(false);
    };
  }, [
    dispatchIsLinting,
    dispatchIsLintingHeavy,
    dispatchMemos,
    lintWorker,
    memo.id,
    memo.result,
    memo.text,
  ]);

  useEffect(() => {
    const handleLintWorkerError = () => {
      dispatchIsLinting(false);

      throw new Error();
    };

    const handleLintWorkerMessage = (event: MessageEvent<LintWorkerMessage>) => {
      if (event.data.text !== memo.text) {
        return;
      }

      dispatchMemos((prevMemos) =>
        prevMemos.map((prevMemo) => ({
          ...prevMemo,
          ...(prevMemo.id === memo.id && { result: event.data.result }),
        }))
      );

      setDeviation(
        50 -
          ((score({ result: event.data.result, text: memo.text }) - scoreAverage) /
            Math.sqrt(scoreVariance)) *
            10
      );
    };

    lintWorker.addEventListener('error', handleLintWorkerError);
    lintWorker.addEventListener('message', handleLintWorkerMessage);

    return () => {
      lintWorker.removeEventListener('error', handleLintWorkerError);
      lintWorker.removeEventListener('message', handleLintWorkerMessage);
    };
  }, [dispatchIsLinting, dispatchMemos, lintWorker, memo.id, memo.text]);

  const isDisplayResult = !isTextContainerFocused && !isLinting;

  const publishToBunreiStockURLSearchParams = new URLSearchParams();

  publishToBunreiStockURLSearchParams.set(
    'text',
    `---
#文例ストック
title: 
license: CC0 1.0 Universal
---

${memo.text.slice(0, 280)}
`
  );

  const handleShareClick = useCallback(async () => {
    try {
      await navigator.share?.({
        text: memo.text,
      });
    } catch (exception) {
      if (!(exception instanceof DOMException) || exception.code !== DOMException.ABORT_ERR) {
        throw exception;
      }
    }
  }, [memo.text]);

  return (
    <EditContainer maxWidth="md">
      <Paper>
        <Box pb={2} pt={2}>
          <Container>
            <Grid container spacing={1} wrap="wrap">
              <Grid item>
                <Chip label={`${isDisplayResult ? memo.text.length : '??'} 文字`} size="small" />
              </Grid>

              <Grid item>
                <Chip
                  clickable
                  component="a"
                  href="https://github.com/hata6502/kohsei-san#校正偏差値"
                  label={`偏差値 ${deviation && isDisplayResult ? Math.round(deviation) : '??'}`}
                  rel="noreferrer"
                  size="small"
                  target="_blank"
                />
              </Grid>

              <Grid item>
                <Chip
                  clickable
                  component="a"
                  href="https://github.com/hata6502/kohsei-san#ネガポジ判定"
                  label={`ネガポジ ${
                    !isDisplayResult || negaposiScore === undefined
                      ? '??'
                      : negaposiScore < -0.6
                      ? '😢'
                      : negaposiScore < -0.2
                      ? '😧'
                      : negaposiScore < 0.2
                      ? '😐'
                      : negaposiScore < 0.6
                      ? '😃'
                      : '😄'
                  }`}
                  rel="noreferrer"
                  size="small"
                  target="_blank"
                />
              </Grid>
            </Grid>

            <TextContainer
              dispatchIsLinting={dispatchIsLinting}
              dispatchIsTextContainerFocused={dispatchIsTextContainerFocused}
              dispatchMemos={dispatchMemos}
              isTextContainerFocused={isTextContainerFocused}
              memo={memo}
            />

            {isDisplayResult &&
              memo.result &&
              (memo.result.messages.length === 0 ? (
                <Alert severity="success">校正を通過しました。おめでとうございます！</Alert>
              ) : (
                <Alert severity="info">
                  <div>
                    自動校正によるメッセージがあります。
                    <FeedbackIcon color="primary" />
                    を押して参考にしてみてください。
                  </div>
                </Alert>
              ))}

            <Box mt={2}>
              <Grid container spacing={1}>
                <Grid item>
                  <Link
                    color="inherit"
                    href={`https://twitter.com/share?${publishToBunreiStockURLSearchParams.toString()}`}
                    rel="noreferrer"
                    target="_blank"
                    underline="none"
                  >
                    <Button color="primary" startIcon={<PublishIcon />} variant="contained">
                      文例ストックに投稿
                    </Button>
                  </Link>
                </Grid>

                {navigator.share && (
                  <Grid item>
                    <Button
                      color="primary"
                      onClick={handleShareClick}
                      startIcon={<ShareIcon />}
                      variant="contained"
                    >
                      共有
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Container>
        </Box>
      </Paper>
    </EditContainer>
  );
};

export { Edit };
