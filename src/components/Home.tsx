import React from "react";
import GroupList from "./Group/GroupList";
import TaskList from "./Task/TaskList";

const Home = () => {
    return (
        <>
            <GroupList isMobile={false}/>
            <TaskList isMobile={false}/>
        </>
    );
};

export default Home;