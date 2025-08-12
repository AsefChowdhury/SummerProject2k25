import Button from "../components/Button/Button";

type ManageDeckProps = {
    mode: "edit" | "create";
}

function ManageDeck(props: ManageDeckProps) {
    return (
        <>
        <div className="page-header">
            <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
            <div className="save-buttons">
                <Button text={props.mode === "edit" ? "Save" : "Create"} type="submit" style="outlined" />
                <Button text={props.mode === "edit" ? "Save and test" : "Create and test"} type="submit" style="filled" />
            </div>
        </div>

        </>
    )
}

export default ManageDeck