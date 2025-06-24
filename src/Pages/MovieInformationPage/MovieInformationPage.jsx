import { useParams } from 'react-router-dom';

import "./MovieInformationPage.css"
import gIcon from "../../assets/classification/G.png";
import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";

// Now Showing Posters
import sinnersPoster from "../../assets/movie-posters/sinners-poster.png";
import spidermanPoster from "../../assets/movie-posters/spiderman.png";
import blackPantherPoster from "../../assets/movie-posters/black-panther.png";
import greatestShowmanPoster from "../../assets/movie-posters/greatest-showman.png";
import dunePoster from "../../assets/movie-posters/dune-part-2.png";
import betterManPoster from "../../assets/movie-posters/better-man.png";
import badBoysPoster from "../../assets/movie-posters/bad-boys.png";
import toyStoryPoster from "../../assets/movie-posters/toy-story-4.png";  
import mufasaPoster from "../../assets/movie-posters/mufasa.png"; 

// Coming Soon Posters
import supermanPoster from "../../assets/movie-posters/Superman.png";
import ballerinaPoster from "../../assets/movie-posters/ballerina.png";
import f1Poster from "../../assets/movie-posters/F1.png";
import fantastic4Poster from "../../assets/movie-posters/fantastic4.jpg";
import liloAndStitchPoster from "../../assets/movie-posters/lilo-and-stitch.png";

import DatePagination from './DataPagination.jsx';

const MovieInformationPage = () => {
  const { movie_name } = useParams();

  const movieData = {
    "Sinners": {
      name: "Sinners",
      poster: sinnersPoster, // or import and use `sinnersPoster`
      classification: maIcon,
      overview: "Trying to leave their troubled lives behind, twin brothers (Michael B. Jordan) return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
      release_date: "17/04/2025",
      run_time: "2 hrs 17 min",
      director: "Ryan Coogler",
      cast: ["Michael B. Jordan", "Hailee Steinfeld", "Miles Caton"],
      classification_details: "Strong horror violence, blood and gore and sex scenes",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "Spiderman-Across-the-Spider-Verse": {
      name: "Spiderman Across the Spider-Verse",
      poster: spidermanPoster, // or import and use `spidermanPoster`
      classification: pgIcon,
      run_time: "2 hrs 0 min",
      cast: ["Oscar Issac", "Shameieek Moore", "Hailee Steinfeld"],
      description: "Miles Morales swings across dimensions with new Spider-heroes.",
      classification_details: "Mild animated violence and coarse language",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "Better-Man": {
      name: "Better Man",
      poster: betterManPoster,
      classification: maIcon,
      cast: ["Oscar Issac", "Shameieek Moore", "Hailee Steinfeld"],
      description: "A biographical film exploring the life of a legendary musician.",
      classification_details: "Strong coarse language and drug use",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "Mufasa-The-Lion-King": {
      name: "Mufasa: The Lion King",
      poster: mufasaPoster,
      classification: pgIcon,
      cast: ["Oscar Issac", "Shameieek Moore", "Hailee Steinfeld"],
      description: "Discover the untold origin story of the king of the Pride Lands.",
      classification_details: "Mild animated violence and coarse language",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "The-Greatest-Showman": {
      name: "The Greatest Showman",
      poster: greatestShowmanPoster,
      classification: pgIcon,
      cast: ["Hugh Jackman", "Zac Efron", "Michelle Williams", "Zendaya"],
      description: "A musical about P.T. Barnum’s creation of show business.",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
      
    }
  };

  const movie = movieData[movie_name];

  if (!movie) {
    return <h2>Movie not found.</h2>;
  }

  return (
    <div>
        <div className='movie-information-page'>
            <img src={movie.poster} alt={movie.name} style={{ width: '300px' }} />
            <div className='movie-information-page-details'>
                <h1 className='movie-information-page-title'>{movie.name}</h1>
                <div className='movie-information-page-classification'>
                    <img src={movie.classification} alt={movie.name} style={{ height: '35px' }} />
                    <p>{movie.classification_details}</p>
                </div>

                <h2>Overview</h2>
                <p className='overview'>{movie.overview}</p>
                <h2>Director</h2>
                <p>{movie.director}</p>

                <h2>Cast</h2>
                <p>{movie.cast.join(", ")}</p>

            </div>

             
        </div>

        <div>
            <h1 className='movie-information-page-showtimes-title'>Showtimes</h1>
      
            <DatePagination dateData = {movie.showtimes} />

        </div>   
    
    </div>
  );
};

export default MovieInformationPage;
