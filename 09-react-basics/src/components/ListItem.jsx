import Tag from "./Tag.jsx";

function ListItem({ text, important }) {
    const itemClass = important ? "item item-important" : "item";

    return (
        <li className={itemClass}>
            <div className="item-main">
                <span className="item-text">{text}</span>

                <div className="item-tags">
                    <Tag label="Travel" />
                    {important && <Tag label="Important" variant="alert" />}
                </div>
            </div>
        </li>
    );
}

export default ListItem;
