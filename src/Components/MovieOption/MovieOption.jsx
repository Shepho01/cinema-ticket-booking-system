import { Link } from "react-router-dom";
import "./MovieOption.css";

function MovieOption(props) {
    return ( 
        <div className="movie-option">
            <Link to={props.link}>
                <img
                    height="350px"
                    src={props.poster}
                    alt={props.name}
                    className="movie-option-image"
                    style={{ cursor: "pointer" }}
                    />
            </Link>

            <div className="movie-option-details">   
                <Link to={props.link}>  
                    <p className="movie-option-name">{props.name}</p>
                    <img
                        width="40px"
                        src={props.classification}
                        className="movie-option-image"
                        alt="classification"
                        />      
                </Link>
            </div>
            
        </div>
    );
}

export default MovieOption;
