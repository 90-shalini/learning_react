class Results_table extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    data: [props.data],
                    testState: FilterMenu.state.env_list,
                };
                console.log(this.state.testState);
            }
            render() {
                return (
                        <div>
                            <h3>Test Cases</h3>
                            <table className="table table-striped table-hover">
                                <thead>
                                <th>Zid</th>
                                <th>Result</th>
                                <th>last Run</th>
                                </thead>
                                <tbody>
                                {this.props.data.map((tc) => (
                                                <tr>
                                                    <td>{tc.zid}</td>
                                                    {tc.result ? (
                                                                    <td className="btn btn-sm btn-success"></td>)
                                                        : (
                                                                    <td className="btn btn-danger"></td>)
                                                    }
                                                    <td>{tc.last_run}</td>
                                                </tr>
                                    )
                                )}
                                </tbody>
                            </table>
                        </div>
                );
            }
        }
   ReactDOM.render(<Results_table/>, document.getElementById('results_table'))