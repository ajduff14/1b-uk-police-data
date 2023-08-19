
import './ForceItem.css';


function ForceItem(props){
    const id = props.id
    const name = props.name

    return(
        <li key={id} className="force-item">
             <a href={"forces/" + id}>{name}</a>
        </li>
    );
}

export default ForceItem;