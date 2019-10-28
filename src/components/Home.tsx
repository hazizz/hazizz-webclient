import React from "react";
import GroupList from "./GroupList";
import TaskList from "./TaskList";

const Home = () => {
    return (
        <>
            <GroupList isMobile={false}/>
            <TaskList isMobile={false}/>
        </>
    );
};

export default Home;