import React from 'react';

type Props = {
    title: string,
    dueDate: string,
    creator: string,
    group: string,
    subject: string,
    tags: Array<string>,
    completed: boolean,
    children: string
};

const TaskLabel = (props: Props) => {
    return (
        <div className={"taskLabel"}>
            <h1>
                <span>{props.title}</span>
                <span>
                    {props.dueDate}&nbsp;
                    <input checked={props.completed} disabled title="Fejlesztés alatt!" type="checkbox" name="completed"
                           id={"completed" + props.title}/>
                </span>
            </h1>
            <p>{props.children}</p>
            <div className="taskDetails">
                <p>Létrehozta: {props.creator}</p>
                <p>Csoport: {props.group}</p>
                <p>Téma: {props.subject}</p>
                <p>Címkék (kidolgozás alatt): {props.tags}</p>
            </div>
        </div>
    );
};

export default TaskLabel;