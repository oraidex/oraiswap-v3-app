import AnimatedNumber from '@components/AnimatedNumber';
import RangeInput from '@components/Inputs/RangeInput/RangeInput';
import SimpleInput from '@components/Inputs/SimpleInput/SimpleInput';
import { Button, Grid, Input, Typography } from '@mui/material';
import {
  calcPrice,
  getTickAtSqrtPriceFromBalance,
  formatNumbers,
  nearestTickIndex,
  showPrefix,
  toMaxNumericPlaces,
  getScaleFromString
} from '@store/consts/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useStyles from './style';
import { Price, getMaxTick, getMinTick } from '@wasm';
import warnIcon from '@static/svg/warn.svg';

export interface IPoolInit {
  tokenASymbol: string;
  tokenBSymbol: string;
  onChangeRange: (leftIndex: number, rightIndex: number) => void;
  isXtoY: boolean;
  xDecimal: number;
  yDecimal: number;
  tickSpacing: number;
  midPrice: bigint;
  onChangeMidPrice: (mid: Price) => void;
  currentPairReversed: boolean | null;
}

export const PoolInit: React.FC<IPoolInit> = ({
  tokenASymbol,
  tokenBSymbol,
  onChangeRange,
  isXtoY,
  xDecimal,
  yDecimal,
  tickSpacing,
  midPrice,
  onChangeMidPrice,
  currentPairReversed
}) => {
  const { classes } = useStyles();

  const [leftRange, setLeftRange] = useState(tickSpacing * 10 * (isXtoY ? -1 : 1));
  const [rightRange, setRightRange] = useState(tickSpacing * 10 * (isXtoY ? 1 : -1));

  const [leftInput, setLeftInput] = useState(
    calcPrice(leftRange, isXtoY, xDecimal, yDecimal).toString()
  );
  const [rightInput, setRightInput] = useState(
    calcPrice(rightRange, isXtoY, xDecimal, yDecimal).toString()
  );

  const [leftInputRounded, setLeftInputRounded] = useState((+leftInput).toFixed(12));
  const [rightInputRounded, setRightInputRounded] = useState((+rightInput).toFixed(12));

  const [midPriceInput, setMidPriceInput] = useState(
    calcPrice(Number(midPrice), isXtoY, xDecimal, yDecimal).toString()
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tickIndex = getTickAtSqrtPriceFromBalance(
      +midPriceInput,
      tickSpacing,
      isXtoY,
      xDecimal,
      yDecimal
    );

    onChangeMidPrice(BigInt(tickIndex));
  }, [midPriceInput]);

  const setLeftInputValues = (val: string) => {
    setLeftInput(val);
    setLeftInputRounded(toMaxNumericPlaces(+val, 5));
  };

  const setRightInputValues = (val: string) => {
    setRightInput(val);
    setRightInputRounded(toMaxNumericPlaces(+val, 5));
  };

  const onLeftInputChange = (val: string) => {
    setLeftInput(val);
    setLeftInputRounded(val);
  };

  const onRightInputChange = (val: string) => {
    setRightInput(val);
    setRightInputRounded(val);
  };

  const changeRangeHandler = (left: number, right: number) => {
    setLeftRange(left);
    setRightRange(right);

    setLeftInputValues(calcPrice(left, isXtoY, xDecimal, yDecimal).toString());
    setRightInputValues(calcPrice(right, isXtoY, xDecimal, yDecimal).toString());

    onChangeRange(left, right);
  };

  const resetRange = () => {
    changeRangeHandler(tickSpacing * 10 * (isXtoY ? -1 : 1), tickSpacing * 10 * (isXtoY ? 1 : -1));
  };

  useEffect(() => {
    changeRangeHandler(leftRange, rightRange);
  }, [midPrice]);

  const validateMidPriceInput = (midPriceInput: string) => {
    const minTick = getMinTick(tickSpacing);
    const maxTick = getMaxTick(tickSpacing);
    const minPrice = isXtoY
      ? calcPrice(minTick, isXtoY, xDecimal, yDecimal)
      : calcPrice(maxTick, isXtoY, xDecimal, yDecimal);
    const maxPrice = isXtoY
      ? calcPrice(maxTick, isXtoY, xDecimal, yDecimal)
      : calcPrice(minTick, isXtoY, xDecimal, yDecimal);
    const numericMidPriceInput = parseFloat(midPriceInput);
    const validatedMidPrice = Math.min(Math.max(numericMidPriceInput, minPrice), maxPrice);
    return toMaxNumericPlaces(validatedMidPrice, 5);
  };

  useEffect(() => {
    if (currentPairReversed !== null) {
      const validatedMidPrice = validateMidPriceInput((1 / +midPriceInput).toString());

      setMidPriceInput(validatedMidPrice);
      changeRangeHandler(rightRange, leftRange);
    }
  }, [currentPairReversed]);

  const price = useMemo(
    () => calcPrice(Number(midPrice), isXtoY, xDecimal, yDecimal),
    [midPrice, isXtoY, xDecimal, yDecimal]
  );

  const allowOnlyDigitsAndTrimUnnecessaryZeros: React.ChangeEventHandler<HTMLInputElement> = e => {
    const onlyNumbersRegex = /^\d*\.?\d*$/;

    const decimal = isXtoY ? xDecimal : yDecimal;
    const test = `^\\d*\\.?\\d{0,${decimal}}$`;
    const regex = new RegExp(test, 'g');
    if (e.target.value === '' || regex.test(e.target.value)) {
      const startValue = e.target.value;
      const caretPosition = e.target.selectionStart;

      let parsed = e.target.value;
      const zerosRegex = /^0+\d+\.?\d*$/;
      if (zerosRegex.test(parsed)) {
        parsed = parsed.replace(/^0+/, '');
      }

      const dotRegex = /^\.\d*$/;
      if (dotRegex.test(parsed)) {
        parsed = `0${parsed}`;
      }

      const diff = startValue.length - parsed.length;

      setMidPriceInput(parsed);
      if (caretPosition !== null && parsed !== startValue) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = Math.max(caretPosition - diff, 0);
            inputRef.current.selectionEnd = Math.max(caretPosition - diff, 0);
          }
        }, 0);
      }
    } else if (!onlyNumbersRegex.test(e.target.value)) {
      setMidPriceInput('');
    } else if (!regex.test(e.target.value)) {
      setMidPriceInput(e.target.value.slice(0, e.target.value.length - 1));
    }
  };

  return (
    <Grid container direction='column' className={classes.wrapper}>
      <Grid
        container
        className={classes.innerWrapper}
        direction='column'
        justifyContent='flex-start'>
        <Grid className={classes.topInnerWrapper}>
          <Typography className={classes.header}>Starting price</Typography>
          <Grid container direction='row' className={classes.infoWrapper} alignItems='center'>
            {/* <Grid>
              <img width={16} height={16} src={warnIcon} />
            </Grid> */}
            <Typography className={classes.info}>
              This pool does not exist yet. To create it, select the fee tier, initial price, and
              enter the amount of tokens. The estimated cost of creating a pool is 0.003 AZERO.
            </Typography>
          </Grid>

          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            direction='row'
            wrap='nowrap'
            className={classes.inputContainer}>
            <Grid
              className={classes.currency}
              container
              justifyContent='center'
              alignItems='center'
              wrap='nowrap'>
              <Typography className={classes.noCurrencyText}>
                {tokenASymbol} starting price
              </Typography>
            </Grid>
            <Grid container direction='column' alignItems='end'>
              <Input
                className={classes.input}
                classes={{ input: classes.innerInput }}
                inputRef={inputRef}
                type={'text'}
                value={midPriceInput}
                disableUnderline={true}
                placeholder={'0.0'}
                onChange={allowOnlyDigitsAndTrimUnnecessaryZeros}
                onBlur={e => {
                  setMidPriceInput(validateMidPriceInput(e.target.value || '0'));
                }}
                disabled={false}
              />
              <Grid color='#979995'>
                {showPrefix(price)} {tokenBSymbol}
              </Grid>
            </Grid>
          </Grid>
          {/* 
          <SimpleInput
            setValue={setMidPriceInput}
            value={midPriceInput}
            decimal={isXtoY ? xDecimal : yDecimal}
            className={classes.midPrice}
            placeholder='0.0'
            onBlur={e => {
              setMidPriceInput(validateMidPriceInput(e.target.value || '0'));
            }}
          /> */}
          {/* 
          <Grid
            className={classes.priceWrapper}
            container
            justifyContent='space-between'
            alignItems='center'>
            <Typography className={classes.priceLabel}>{tokenASymbol} starting price: </Typography>
            <Typography className={classes.priceValue}>
              <AnimatedNumber
                value={price.toFixed(isXtoY ? Number(xDecimal) : Number(yDecimal))}
                duration={300}
                formatValue={formatNumbers()}
              />
              {showPrefix(price)} {tokenBSymbol}
            </Typography>
          </Grid> */}
        </Grid>
        <Typography className={classes.subheader}>Set price range</Typography>
        <Grid container className={classes.inputs}>
          <RangeInput
            className={classes.input}
            label='Min price'
            tokenFromSymbol={tokenASymbol}
            tokenToSymbol={tokenBSymbol}
            currentValue={leftInputRounded}
            setValue={onLeftInputChange}
            decreaseValue={() => {
              const newLeft = isXtoY
                ? Math.max(Number(getMinTick(tickSpacing)), Number(leftRange - tickSpacing))
                : Math.min(Number(getMaxTick(tickSpacing)), Number(leftRange + tickSpacing));
              changeRangeHandler(newLeft, rightRange);
            }}
            increaseValue={() => {
              const newLeft = isXtoY
                ? Math.min(Number(rightRange - tickSpacing), Number(leftRange + tickSpacing))
                : Math.max(Number(rightRange + tickSpacing), Number(leftRange - tickSpacing));
              changeRangeHandler(newLeft, rightRange);
            }}
            onBlur={() => {
              const newLeft = isXtoY
                ? Math.min(
                    Number(rightRange - tickSpacing),
                    Number(nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  )
                : Math.max(
                    Number(rightRange + tickSpacing),
                    Number(nearestTickIndex(+leftInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  );
              changeRangeHandler(newLeft, rightRange);
            }}
            diffLabel='Min Current price'
            percentDiff={((+leftInput - price) / price) * 100}
          />
          <RangeInput
            className={classes.input}
            label='Max price'
            tokenFromSymbol={tokenASymbol}
            tokenToSymbol={tokenBSymbol}
            currentValue={rightInputRounded}
            setValue={onRightInputChange}
            decreaseValue={() => {
              const newRight = isXtoY
                ? Math.max(Number(rightRange - tickSpacing), Number(leftRange + tickSpacing))
                : Math.min(Number(rightRange + tickSpacing), Number(leftRange - tickSpacing));
              changeRangeHandler(leftRange, newRight);
            }}
            increaseValue={() => {
              const newRight = isXtoY
                ? Math.min(Number(getMaxTick(tickSpacing)), Number(rightRange + tickSpacing))
                : Math.max(Number(getMinTick(tickSpacing)), Number(rightRange - tickSpacing));
              changeRangeHandler(leftRange, newRight);
            }}
            onBlur={() => {
              const newRight = isXtoY
                ? Math.max(
                    Number(leftRange + tickSpacing),
                    Number(nearestTickIndex(+rightInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  )
                : Math.min(
                    Number(leftRange - tickSpacing),
                    Number(nearestTickIndex(+rightInput, tickSpacing, isXtoY, xDecimal, yDecimal))
                  );

              changeRangeHandler(leftRange, newRight);
            }}
            diffLabel='Max Current price'
            percentDiff={((+rightInput - price) / price) * 100}
          />
        </Grid>
        <Grid container className={classes.buttons}>
          <Button className={classes.button} onClick={resetRange}>
            Reset range
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              changeRangeHandler(
                isXtoY ? getMinTick(tickSpacing) : getMaxTick(tickSpacing),
                isXtoY ? getMaxTick(tickSpacing) : getMinTick(tickSpacing)
              );
            }}>
            Set full range
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PoolInit;
