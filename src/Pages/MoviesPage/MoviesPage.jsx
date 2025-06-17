import "./MoviesPage.css";
import React, { useState } from 'react';
import MovieOption from '../../Components/MovieOption/MovieOption';

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


function MoviesPage() {
    const [showingNow, setShowingNow] = useState(true);
    const [comingSoon, setComingSoon] = useState(false);

    const toggleShowingNow = () => {
    setShowingNow(true);
    setComingSoon(false);
    };

    const toggleComingSoon = () => {
    setShowingNow(false);
    setComingSoon(true);
    };

    return ( 
        <div>
            <div className="homepage-showing-options">
                <h1
                onClick={toggleShowingNow}
                className={`homepage-option ${showingNow ? 'active' : ''}`}
                >
                Now Showing
                </h1>
                <h1
                onClick={toggleComingSoon}
                className={`homepage-option ${comingSoon ? 'active' : ''}`}
                >
                Coming Soon
                </h1>
            </div>
        
            <div className="homepage-movies-section">
                {showingNow && (
                <div className="homepage-movies-page-movie">
                    <MovieOption name = "Sinners" poster = {sinnersPoster} classification = {maIcon}/>
                    <MovieOption name = "Spiderman Across the Spider-Verse" poster = {spidermanPoster} classification = {pgIcon}/>
                    <MovieOption name = "Better Man" poster = {betterManPoster} classification = {maIcon}/>
                    <MovieOption name = "Mufasa: The Lion King" poster = {mufasaPoster} classification = {pgIcon}/>
                    <MovieOption name = "The Greatest Showman" poster = {greatestShowmanPoster} classification = {pgIcon}/>
                    <MovieOption name = "Black Panther" poster = {blackPantherPoster} classification = {mIcon}/>
                    <MovieOption name = "Dune Part 2" poster = {dunePoster} classification = {mIcon}/>
                    <MovieOption name = "Bad Boys 2" poster = {badBoysPoster} classification = {maIcon}/>
                    <MovieOption name = "Toy Story 4" poster = {toyStoryPoster} classification = {gIcon}/>
                </div>
                )}

                {comingSoon && (
                <div className="homepage-movies-page-movie">
                    <MovieOption name = "Superman" poster = {supermanPoster} classification = {mIcon}/>
                    <MovieOption name = "Ballerina" poster = {ballerinaPoster} classification = {maIcon}/>
                    <MovieOption name = "Fantastic 4: First Steps" poster = {fantastic4Poster} classification = {mIcon}/>
                    <MovieOption name = "F1" poster = {f1Poster} classification = {mIcon}/>
                    <MovieOption name = "Lilo and Stitch" poster = {liloAndStitchPoster} classification = {pgIcon}/>
                </div>
                )}
            </div>
           
        </div>
     );
}

export default MoviesPage;