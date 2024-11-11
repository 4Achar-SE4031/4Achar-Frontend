import "./Card.css";

const Card = (props: any) => {
  const classes = "card " + props.className;

  return (
    <center>
      <div className={classes}>{props.children}</div>
    </center>
  );
};  

export default Card;
