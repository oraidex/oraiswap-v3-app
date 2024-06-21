import NoDataSvg from '@static/svg/NoDataPool.svg';
import { useStyles } from './style';

export const FallbackEmptyData = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.noData}>
      <img src={NoDataSvg} alt='nodata' />
      <span>No data</span>
    </div>
  );
};
