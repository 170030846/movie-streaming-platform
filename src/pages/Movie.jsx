import React from 'react'
import { useParams } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import { makeStyles } from '@mui/styles';
import { Icon, Stack } from '@mui/material';

const useStyles = makeStyles({
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  box1: {
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
  }
})
const Movie = () => {
  const classes = useStyles();
  const params = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const [movie, setMovie] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=19c820ff2fdbff7d52d2f6ed534e3aa6&language=en-US`
      ).then(res => {
        console.log(res.data);
        setMovie(res.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
    };
    fetchData();
  }, [params.id]);

  return (
    // <div>Movie, {params.id}</div>
    loading ? <div>Loading...</div> :
    error ? <div>Error</div> :
      <Stack direction={matches ? 'column' : 'row'}>
      <div className={classes.box}>
        <div className={classes.box1}>
          <Icon baseClassName='material-icons-round' style={{color: '#323232', cursor: 'pointer'}}
            onClick={() => window.history.back()}
          >keyboard_backspace</Icon>
          <h1 style={{padding: "20px 0px"}}>{movie.title}</h1>
          <p style={{fontWeight: 600, marginBottom: 10, color: '#121212'}}>Rating: {movie.vote_average} / 10</p>
          <p style={{color: '#464646', lineHeight: 1.6}}>{movie.overview}</p>
          <table style={{borderSpacing: 12}}>
            <tr>
              <td>Genres</td>
              <td>{movie.genres.map((i) => (i.name + ", "))}</td>
            </tr>
            <tr>
              <td>Release Date</td>
              <td>{movie.release_date}</td>
            </tr>
          </table>
        </div>
      </div>
      <div className={classes.box}>
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </div>
    </Stack>
  )
}

export default Movie