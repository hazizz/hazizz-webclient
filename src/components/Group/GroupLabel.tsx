import React from 'react';

interface Props {
    name: string,
    userCount: number,
}

const GroupLabel = (props: Props) => {
    return (
        <div className={"groupLabel"}>
            Név: <span className={"groupName"}>{props.name}</span>&nbsp;
            Létszám: <span className={"groupUserCount"}>{props.userCount}</span>
        </div>
    );
};

export default GroupLabel;