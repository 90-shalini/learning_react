class MainComponent extends React.Component {
   constructor() {
     super();
     this.state={
      env_list: [],
      db_list: [],
      selectedEnvironment: 'Select Environment:',
      selectedDatabase: 'Select Database:',
      result_list:[],
      stats_data:[] };
   }
   handleEnvChange = (event) => {
       this.setState({selectedEnvironment: event.target.value}, () => {
            var db_list_url = 'http://'+window.location.hostname+':5000/ui/'+ this.state.selectedEnvironment;
            axios.get(db_list_url)
                    .then(response => {
                        this.setState({db_list: response.data})
                     })
                    .catch(function (error){
                        console.log(error)
                    });
        });
   }
   handleDbChange = (event) => {
       this.setState({selectedDatabase : event.target.value}, () =>{
           var results_url = 'http://'+window.location.hostname+':5000/ui/tests/' + this.state.selectedEnvironment +'/'+
                                this.state.selectedDatabase;
          var stats_url = 'http://'+window.location.hostname+':5000/ui/stats/' + this.state.selectedEnvironment +'/'+
                            this.state.selectedDatabase;
           console.log(stats_url);
           axios.get(results_url)
                .then(results_response => {
                    this.setState({result_list: results_response.data});
                 })
                .catch(function (error){
                    console.log(error)
                });

           axios.get(stats_url)
                .then(stats_response => {
                    this.setState({stats_data: stats_response.data});
                    console.log(stats_response.data);
                    console.log(this.state.stats_data);
                })
                .catch(function (error){
                    console.log(error)
                });

           });
   }
   componentWillMount(){
        var env_list_url = 'http://'+window.location.hostname+':5000/ui';
        axios.get(env_list_url)
            .then(response => {
                this.setState({env_list: response.data}, () => {
                        var db_url = 'http://'+window.location.hostname+':5000/ui/'+ this.state.env_list[0];
                            axios.get(db_url)
                                .then(response => {
                                    this.setState({db_list: response.data},()=>{
                                        var results_url = 'http://'+window.location.hostname+':5000/ui/tests/' + this.state.env_list[0] +'/'+
                                                                    this.state.db_list[0];
                                        var stats_url = 'http://'+window.location.hostname+':5000/ui/stats/' + this.state.env_list[0] +'/'+
                                                                this.state.db_list[0];
                                        axios.get(stats_url)
                                            .then(stats_response => {
                                                this.setState({stats_data: stats_response.data});
                                            })
                                            .catch(function (error){
                                                console.log(error)
                                            });
                                        axios.get(results_url)
                                            .then(results_response => {
                                                this.setState({result_list: results_response.data});
                                             })
                                            .catch(function (error){
                                                console.log(error)
                                            });
                                        })
                                })
                                .catch(function (error){
                                    console.log(error)
                                });
                });
             })
            .catch(function (error){
                console.log(error)
            });
        }
   render() {

         return (
             <div class="panel panel-lg panel-custom">
                <div>
                    <Stats stats = {this.state.stats_data}/>
                </div>
                <div id="filterPane" className="pve_filterWrapper">
                    <Env_dropdown envs={this.state.env_list} onChangeSelection={this.handleEnvChange}/>
                    <DB_dropdown db={this.state.db_list} onChangeSelection={this.handleDbChange}/>
                </div>
                <div id="resultsTable" className="pve_resultWrapper">
                    <Results_table results={this.state.result_list}/>
                </div>
             </div>
         );
    }
}

class Stats extends React.Component{
    constructor(props){
        super(props);
        this.state = {open: true};
    }
     render(){
        var Button = ReactBootstrap.Button;
        var Panel = ReactBootstrap.Panel;
        var Glyphicon = ReactBootstrap.Glyphicon;
            return (

                    <div className="test_status">
                            <Panel collapsible defaultExpanded expanded ={this.state.open} header="Stats"
                            onClick={() => this.setState({ open: !this.state.open })}>
                            <Glyphicon bsStyle="Info" className="glyphicon" glyph="chevron-down"/>
                            {/*</Button>*/}



                         <div className="pv_mini-dashboard__wrap total">
                              <div className="icon-container">
                                <Glyphicon bsStyle="info" className="glyphicon" glyph="info-sign"/>
                              </div>
                              <div className="pv_mini-dashboard__wrap details">
                                <span className="details-count">{this.props.stats['total']}</span>
                                  <span className="details-label"> Total</span>
                              </div>
                             </div>
                        <div className="pv_mini-dashboard__wrap passed">
                              <div className="icon-container">
                                <Glyphicon bsStyle="success" className="glyphicon" glyph="ok"/>
                              </div>
                              <div className="pv_mini-dashboard__wrap details">
                                <span className="details-count">{this.props.stats['passed']}</span>
                                <span className="details-label"> Passed</span>
                              </div>
                          </div>
                         <div className="pv_mini-dashboard__wrap failed">
                              <div className="icon-container">
                                <Glyphicon bsStyle="danger" className="glyphicon" glyph="remove"/>
                              </div>
                              <div className="pv_mini-dashboard__wrap details">
                               <span className="details-count">{this.props.stats['failed']}</span>
                               <span className="details-label"> Failed</span>
                              </div>
                          </div>
                   </Panel>
                </div>
            );
            }
    }

class Env_dropdown extends React.Component {
    constructor(props){
        super(props);
    };
    render(){
         var envOptions = this.props.envs.map((env) =>{
            return <option>{env}</option>
         })
        return(<div className="ProductFilter__section-container">
                   <label>Environment</label>
                   <select id="env_dropdown" onChange={(event) => this.props.onChangeSelection(event)}>
                       {envOptions}
                   </select>
                </div>
           );
        }
    }

class DB_dropdown extends React.Component {
    constructor(props){
        super(props);
    };
    render(){
        var dbOptions = this.props.db.map((db_name) =>{
            return <option>{db_name}</option>
         })
        return (<div className="ProductFilter__section-container">
                   <label>Database</label>
                   <select id="db_dropdown" onChange={(event) => this.props.onChangeSelection(event)}>
                        {dbOptions}
                   </select>
                </div>);
    }
}

class Results_table extends React.Component {

    constructor(props) {
        super(props);

        function getStatusRow(status) {
            if(status.passed) {
                return <span className='btn btn-sm btn-outline-success'/>
            } else {
                return <span className='btn btn-sm btn-danger'/>
            }
        }

        this.getStatusCell = (testcase) => {
            return <div>
                {testcase.status && testcase.status.map(getStatusRow)}
            </div>
        }
    }
    render() {
        var Table = ReactBootstrap.Table;
           return (
                <Table striped bordered condensed hover>
                    <thead>
                        <th className="name-header" column="zid">ZID</th>
                        <th className="name-header" column="status">Test Status</th>
                        <th className="name-header" column="run">Run</th>
                    </thead>
                    <tbody>
                    {this.props.results.map((testcase) => (
                        <tr>
                            <td><a href={"http://jira/browse/" + testcase.zid}>{testcase.zid}</a></td>

                                <td>
                                    <div className="status_column">
                                        {this.getStatusCell(testcase)}
                                    </div>

                            </td>
                            <td>{testcase.last_run}</td>
                        </tr>)
                    )}
                </tbody>
                </Table>
           );
    }
}

class ModalDialog extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var Modal  = ReactBootstrap.Modal;
            return (
                <div>
                    <Modal>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h1>My Modal dialog</h1>
                        </Modal.Body>
                    </Modal>
                </div>
            );
    }
}

ReactDOM.render(<MainComponent/>, document.getElementById('wrapper'));

