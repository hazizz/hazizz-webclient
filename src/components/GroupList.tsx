import React, {Component} from "react";

import {hazizzInstance} from "../axios/instaces";

import {connect} from "react-redux";
import GroupLabel from "./GroupLabel";
import Loader from "./Loader";

import {Group} from "../types/types";

type Props = {
    isMobile: boolean,
    token: string
}

type State = {
    render: any
}


class GroupList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            render: <Loader/>
        };
    }


    componentDidMount(): void {
        hazizzInstance({
            url: '/me/groups',
            headers: {"Authorization": "Bearer " + this.props.token}
        })
            .then(resp => {
                const groupDetails: Array<Group> = resp.data;

                this.setState({
                    render: groupDetails.map(group => (<GroupLabel key={group.id} name={group.name} userCount={group.userCount}/>))
                });
            });
    }

    render() {
        return (
            <section className={"groupSection"}>
                Csoportjaid: {this.state.render}
            </section>
        );
    }
}

const
    mapStateToProps = (state: any) => {
        return {token: state.auth.token};
    };

export default connect(mapStateToProps)(GroupList);