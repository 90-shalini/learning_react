class Stats extends React.Component{
    constructor(){
        super();
        this.state = {open: true, stat_data: []};
    }
    componentDidMount(){
        var stats_url = 'http://'+window.location.hostname+':5000/ui/stats/blevmpve02.eu.planview.world/ui_shalini'
        axios.get(stats_url)
            .then(response => {
                this.setState({stat_data: response.data});
            })
            .catch(function (error){
                console.log(error)
            });
    }

    render(){
    var Button = ReactBootstrap.Button;
    var Panel = ReactBootstrap.Panel;
    var Glyphicon = ReactBootstrap.Glyphicon;
        return (
            <div>
                <div className="test_status">
                        <Button bsSize="xsmall"
                        onClick={() => this.setState({ open: !this.state.open })}>
                        <Glyphicon bsStyle="Info" className="glyphicon" glyph="chevron-down"/>
                        </Button>
                </div>
                <Panel collapsible defaultExpanded expanded={this.state.open}>
                      <div className="total_tests">
                          <Glyphicon bsStyle="info" className="glyphicon" glyph="info-sign"/>
                        <span> Total</span>
                        <span className="total_status">{this.state.stat_data['total']}</span>
                      </div>

                      <div className="table_pass">
                          <Glyphicon bsStyle="success" className="glyphicon" glyph="ok"/>
                        <span> Passed</span>
                        <span className="passed_status">{this.state.stat_data['passed']}</span>
                      </div>

                      <div className="table_fail">
                          <Glyphicon bsStyle="danger" className="glyphicon" glyph="remove"/>
                        <span> Failed</span>
                        <span className="failed_status">{this.state.stat_data['failed']}</span>
                      </div>

                </Panel>
            </div>
        );
        }
    }
    ReactDOM.render(<Stats/>, document.getElementById('status'))