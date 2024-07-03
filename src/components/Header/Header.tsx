import NavbarButton from '@components/Navbar/Button';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './style';
import classNames from 'classnames';
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
      link: 'pools',
      name: 'Pools'
    },
    {
      link: 'positions',
      name: 'Your Positions'
    },
    {
      link: 'status',
      name: 'Status'
    }
  ];

  const otherRoutesToHighlight: Record<string, RegExp[]> = {
    positions: [/^newPosition\/*/, /^position\/*/]
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
        wrap='wrap'
        gap={1}>
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
        {/* <Link
          key={`path-positions`}
          to={`/positions`}
          className={classNames(classes.link, classes.rightMenu)}>
          <NavbarButton
            name={'Your Positions'}
            onClick={() => {
              setActive('positions');
            }}
            active={
              'positions' === activePath ||
              (!!otherRoutesToHighlight['positions'] &&
                otherRoutesToHighlight['positions'].some(pathRegex => pathRegex.test(activePath)))
            }
          />
        </Link> */}
      </Grid>
    </Grid>
  );
};
export default Header;
