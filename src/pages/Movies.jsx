import React from 'react'
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardContent, CardMedia, Icon, InputAdornment, Pagination, Stack, TextField } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '0px 20px',
  },
  endAdornment: {
    backgroundColor: '#7089e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    marginRight: '-22px',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }
})

const StyledDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: "0px 60px",
  // position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    padding: "0px 10px",
  },
}));


const Movies = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [page, setPage] = React.useState(1);
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const [searchPage, setSearchPage] = React.useState(1);

  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [searchedMovies, setSearchedMovies] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios(
        `https://api.themoviedb.org/3/movie/popular?api_key=19c820ff2fdbff7d52d2f6ed534e3aa6&language=en-US&page=${page}`
      ).then(res => {
        console.log(res.data);
        setMovies(res.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
    };
    fetchData();
  }, [page]);

  const searchMovies = async(search, value) => {
    setLoading(true);
    console.log(search);
    await axios(`https://api.themoviedb.org/3/search/movie?api_key=19c820ff2fdbff7d52d2f6ed534e3aa6&query=${search}&language=en-US&page=${value}&include_adult=false`)
    .then(res => {
      console.log(res.data);
      setSearchedMovies(res.data);
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
    });
  }

  return (
    <div className={classes.container}>
      <TextField 
        id="search"
        value={search}
        onChange={(e) => {setSearch(e.target.value); searchMovies(e.target.value)}}
        margin="normal"
        variant="outlined"
        fullWidth
        placeholder="Search movies"
        size='small'
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <div className={classes.endAdornment}>
                <Icon baseClassName='material-icons-round' style={{color: '#fff'}}>search</Icon>
              </div>
            </InputAdornment>
          ),
        }}
      />
      <h1 style={{padding: "20px 60px"}}>{search === '' ? 'Trending' : `Search results for "${search}"`}</h1>
      <StyledDiv>
        {
          loading ? <div>Loading...</div> :
          search === '' ?
          <Stack direction="column" alignItems="center" justifyContent="center" spacing={2}>
            <Stack direction="row" flexWrap={'wrap'}>
              {movies.results.map((movie, index) => (
                <Card 
                  elevation={0} 
                  sx={{ maxWidth: 345, width: 250, margin: 1, mb: 3 }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <CardActionArea>
                    <CardMedia 
                      component="img"
                      height="140"
                      image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <CardContent style={{padding: "10px", margin: 0, backgroundColor: '#d9d9d9',}}>
                      <h3>{movie.title}</h3>
                      <Stack direction="row" alignItems="center" sx={{mt: .5}}>
                        <Icon baseClassName='material-icons-round' style={{color: '#ffa500', fontSize: 18, marginRight: 5}}>star</Icon>
                      <h4>{movie.vote_average} / 10</h4>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))} 
            </Stack>
            <Pagination 
              count={movies.total_pages > 500 ? 500 : movies.total_pages} 
              page={page} 
              onChange={handleChangePage} 
              color="primary"
              style={{margin: "20px 0px", color: '#ff6a63'}}
            />
          </Stack> : 
          <Stack direction="column" alignItems="center" justifyContent="center" spacing={2}>
            <Stack direction="row" flexWrap={'wrap'}>
              {searchedMovies.results.map((movie, index) => (
                <Card 
                  elevation={0} 
                  sx={{ maxWidth: 345, width: 250, margin: 1, mb: 3 }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <CardActionArea>
                    <CardMedia 
                      component="img"
                      height="140"
                      image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <CardContent style={{padding: "10px", margin: 0, backgroundColor: '#d9d9d9',}}>
                      <h3>{movie.title}</h3>
                      <Stack direction="row" alignItems="center" sx={{mt: .5}}>
                        <Icon baseClassName='material-icons-round' style={{color: '#ffa500', fontSize: 18, marginRight: 5}}>star</Icon>
                      <h4>{movie.vote_average} / 10</h4>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
            <Pagination 
              count={searchedMovies.total_pages > 500 ? 500 : searchedMovies.total_pages} 
              page={searchPage} 
              onChange={(event, value) => {setSearchPage(value); searchMovies(search, value); }} 
              color="primary"
              style={{margin: "20px 0px", color: '#ff6a63'}}
            />
          </Stack>
        }
      </StyledDiv>
    </div>
  )
}

export default Movies