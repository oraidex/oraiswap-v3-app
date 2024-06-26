import WrappedPoolList from '@containers/WrappedPoolList/WrappedPoolList';
import { Grid } from '@mui/material';
import useStyles from './styles';

const ListPool: React.FC = () => {
  const { classes } = useStyles();
  return (
    <Grid container className={classes.container}>
      <WrappedPoolList />
    </Grid>
  );
};

export default ListPool;
