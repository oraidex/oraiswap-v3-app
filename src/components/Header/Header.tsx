import NavbarButton from '@components/Navbar/Button';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './style';
export interface IHeader {
  landing: string;
}

export const Header: React.FC<IHeader> = ({ landing }) => {
  const { classes } = useStyles();

  const routes = [
    {
      link: 'swap',
      name: 'Swap'
    },
    {
      link: 'pool',
      name: 'Your Liquidity Positions'
    }
  ];

  const otherRoutesToHighlight: Record<string, RegExp[]> = {
    pool: [/^newPosition\/*/, /^position\/*/]
  };

  const [activePath, setActive] = useState('swap');

  useEffect(() => {
    // if there will be no redirects, get rid of this
    setActive(landing);
  }, [landing]);

  return (
    <Grid container>
      <Grid
        container
        className={classes.root}
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        wrap='nowrap'>
        <Grid
          container
          item
          className={classes.routers}
          wrap='nowrap'
          // sx={{ display: { xs: 'none', lg: 'block' } }}
        >
          {routes.map(path => (
            <Link key={`path-${path.link}`} to={`/${path.link}`} className={classes.link}>
              <NavbarButton
                name={path.name}
                onClick={() => {
                  setActive(path.link);
                }}
                active={
                  path.link === activePath ||
                  (!!otherRoutesToHighlight[path.link] &&
                    otherRoutesToHighlight[path.link].some(pathRegex => pathRegex.test(activePath)))
                }
              />
            </Link>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Header;
