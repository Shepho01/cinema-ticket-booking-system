import "./MovieOption.css"

function MovieOption(props) {
    return ( 
        <div className="movie-option">
            <img height="350px" src={props.poster} alt={props.name} className="movie-option-image" />
            <div className="movie-option-details">
                <p className="movie-option-name" >{props.name}</p>
                <img width="40px" src={props.classification} className="movie-option-image" />
            
            </div>
        </div>
     );
}

export default MovieOption;