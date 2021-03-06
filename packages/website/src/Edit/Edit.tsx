import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SettingsIcon from '@material-ui/icons/Settings';
import ShareIcon from '@material-ui/icons/Share';
import TwitterIcon from '@material-ui/icons/Twitter';
import Alert from '@material-ui/lab/Alert';
import type { LintWorkerLintMessage, LintWorkerResultMessage } from '../lintWorker';
import { useDispatchSetting } from '../useMemo';
import type { Memo, MemosAction } from '../useMemo';
import { SettingDialog } from './SettingDialog';
import { TextContainer } from './TextContainer';

const lintingTimeoutLimitMS = 10000;

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
}> = React.memo(
  ({ dispatchIsLinting, dispatchIsLintingHeavy, dispatchMemos, isLinting, lintWorker, memo }) => {
    const [isTextContainerFocused, dispatchIsTextContainerFocused] = useState(false);

    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
    const [isTweetDialogOpen, setIsTweetDialogOpen] = useState(false);

    const [negaposiScore, setNegaposiScore] = useState<number>();

    const dispatchSetting = useDispatchSetting({ dispatchMemos, memoId: memo.id });

    useEffect(
      () => () => {
        dispatchIsLinting(false);
      },
      [dispatchIsLinting]
    );

    useEffect(() => {
      let isMounted = true;

      (async () => {
        const { analyzeNegaposi } = await import(/* webpackChunkName: "negaposi" */ 'negaposi');

        if (isMounted) {
          setNegaposiScore(analyzeNegaposi({ text: memo.text }));
        }
      })();

      return () => {
        isMounted = false;
      };
    }, [memo.text, setNegaposiScore]);

    useEffect(() => {
      if (!lintWorker || memo.result) {
        return;
      }

      const message: LintWorkerLintMessage = {
        lintOption: {
          professional: true,
          standard: false,
        }[memo.setting.mode]
          ? memo.setting.lintOption
          : {},
        text: memo.text,
      };

      lintWorker.postMessage(message);

      const lintingTimeoutID = setTimeout(
        () => dispatchIsLintingHeavy(true),
        lintingTimeoutLimitMS
      );

      dispatchIsLinting(true);
      dispatchIsLintingHeavy(false);

      return () => clearTimeout(lintingTimeoutID);
    }, [
      dispatchIsLinting,
      dispatchIsLintingHeavy,
      dispatchMemos,
      lintWorker,
      memo.id,
      memo.result,
      memo.setting.lintOption,
      memo.text,
    ]);

    useEffect(() => {
      const handleLintWorkerError = () => {
        dispatchIsLinting(false);

        throw new Error();
      };

      const handleLintWorkerMessage = (event: MessageEvent<LintWorkerResultMessage>) => {
        if (event.data.text !== memo.text) {
          return;
        }

        dispatchMemos((prevMemos) =>
          prevMemos.map((prevMemo) => ({
            ...prevMemo,
            ...(prevMemo.id === memo.id && { result: event.data.result }),
          }))
        );
      };

      lintWorker.addEventListener('error', handleLintWorkerError);
      lintWorker.addEventListener('message', handleLintWorkerMessage);

      return () => {
        lintWorker.removeEventListener('error', handleLintWorkerError);
        lintWorker.removeEventListener('message', handleLintWorkerMessage);
      };
    }, [dispatchIsLinting, dispatchMemos, lintWorker, memo.id, memo.text]);

    const shouldDisplayResult = !isTextContainerFocused && !isLinting;

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

    const handleSettingButtonClick = useCallback(() => setIsSettingDialogOpen(true), []);
    const handleSettingDialogClose = useCallback(() => setIsSettingDialogOpen(false), []);

    const handleTweetButtonClick = useCallback(() => setIsTweetDialogOpen(true), []);

    const handleTweetDialogAgree = useCallback(() => {
      const urlSearchParams = new URLSearchParams();

      urlSearchParams.set(
        'text',
        `---
#文例ストック
title: 
license: CC0 1.0 Universal
---

${memo.text.slice(0, 280)}
`
      );

      window.open(`https://twitter.com/share?${urlSearchParams.toString()}`);

      setIsTweetDialogOpen(false);
    }, [memo.text]);

    const handleTweetDialogClose = useCallback(() => setIsTweetDialogOpen(false), []);

    return (
      <EditContainer maxWidth="md">
        <Paper>
          <Box pb={2} pt={2}>
            <Container>
              <Grid container spacing={1} wrap="wrap">
                <Grid item>
                  <Chip
                    label={`${shouldDisplayResult ? memo.text.length : '??'} 文字`}
                    size="small"
                  />
                </Grid>

                <Grid item>
                  <Chip
                    clickable
                    component="a"
                    href="https://helpfeel.com/kohsei-san/%E3%83%8D%E3%82%AC%E3%83%9D%E3%82%B8%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%99%E3%81%8B%EF%BC%9F-6085405379aaac001c0346e9"
                    label={`ネガポジ ${
                      !shouldDisplayResult || negaposiScore === undefined
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
                shouldDisplayResult={shouldDisplayResult}
              />

              {memo.result &&
                (memo.result.messages.length === 0 ? (
                  <Alert
                    severity="success"
                    style={{
                      visibility: shouldDisplayResult ? 'visible' : 'hidden',
                    }}
                  >
                    校正を通過しました。おめでとうございます！
                  </Alert>
                ) : (
                  <Alert
                    severity="info"
                    style={{
                      visibility: shouldDisplayResult ? 'visible' : 'hidden',
                    }}
                  >
                    自動校正によるメッセージがあります。
                    <FeedbackIcon color="primary" />
                    を押して参考にしてみてください。
                  </Alert>
                ))}

              <Box mt={2}>
                <Grid container spacing={1}>
                  {navigator.share && (
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleShareClick}
                        startIcon={<ShareIcon />}
                      >
                        共有
                      </Button>
                    </Grid>
                  )}

                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<TwitterIcon />}
                      onClick={handleTweetButtonClick}
                    >
                      文例ストックにツイート
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      onClick={handleSettingButtonClick}
                    >
                      設定
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Box>
        </Paper>

        <SettingDialog
          dispatchSetting={dispatchSetting}
          open={isSettingDialogOpen}
          setting={memo.setting}
          onClose={handleSettingDialogClose}
        />

        <Dialog open={isTweetDialogOpen} onClose={handleTweetDialogClose}>
          <DialogTitle>文章を Twitter に投稿しますか？</DialogTitle>

          <DialogContent>
            <DialogContentText>ハッシュタグ #文例ストック が付きます。</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleTweetDialogClose} color="primary" autoFocus>
              投稿しない
            </Button>

            <Button onClick={handleTweetDialogAgree} color="primary">
              投稿する
            </Button>
          </DialogActions>
        </Dialog>
      </EditContainer>
    );
  }
);

export { Edit };
