import React, {Component} from 'react';
import Loader from "../Loader";
import {hazizzInstance} from "../../axios/instaces";
import {connect} from 'react-redux';
import moment from "moment";

import {PublicTaskData} from "../../types/types";
import TaskLabel from "./TaskLabel";

type Props = {
    isMobile: boolean,
    token: string
}

type State = {
    render: any
}

class TaskList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            render: <Loader/>
        }
    }

    componentDidMount(): void {
        hazizzInstance({
            url: '/v2/me/tasks',
            headers: {"Authorization": "Bearer " + this.props.token},
            params: {
                showThera: true,
                unfinishedOnly: false,
                finishedOnly: false,
                startingDate: moment().format("YYYY-MM-DD"),
                endDate: moment().add(1, "M").format("YYYY-MM-DD")
            }
        })
            .then(resp => {
                const data: Array<PublicTaskData> = resp.data;

                this.setState({
                    render: data.map(task => (<TaskLabel key={task.id}
                                                         completed={task.completed}
                                                         creator={task.creator.displayName}
                                                         dueDate={task.dueDate}
                                                         group={task.group.name}
                                                         subject={task.subject.name}
                                                         tags={task.tags}
                                                         content={task.description}>
                            {task.description}
                        </TaskLabel>)
                    )
                });
            });
    }

    render() {
        return (
            <section className={"taskList"}>
                {this.state.render}
            </section>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {token: state.auth.token}
};

export default connect(mapStateToProps)(TaskList);