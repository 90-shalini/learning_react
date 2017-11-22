class FilterMenu extends React.Component {
   constructor() {
     super();
     this.state={open: true,
      env_list: [],
      db_list: [],
      selectedEnvironment: 'Select Environment:',
      selectedDatabase: 'Select Database:',
      result_list:[]};
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
       axios.get(results_url)
            .then(results_response => {
                this.setState({result_list: results_response.data});
             })
            .catch(function (error){
                console.log(error)
            });

       });
   }
   componentDidMount(){
    var env_list_url = 'http://'+window.location.hostname+':5000/ui';
    axios.get(env_list_url)
            .then(response => {
                this.setState({env_list: response.data})
             })
            .catch(function (error){
                console.log(error)
            });
    }

   render() {
      var Panel = ReactBootstrap.Panel;
      var Button = ReactBootstrap.Button;
      var Glyphicon = ReactBootstrap.Glyphicon;
         return (
             <div class="panel panel-lg panel-custom">
                <div id="filterPane" className="pve_filterWrapper">
                  <Button onClick={()=>this.setState({open:!this.state.open})}>
                    <Glyphicon bsStyle="Info" className="glyphicon" glyph="filter"/>
                </Button>
                  <Panel collapsible defaultExpanded expanded={this.state.open}>
                        <Env_dropdown envs={this.state.env_list} onChangeSelection={this.handleEnvChange}/>
                        <DB_dropdown db={this.state.db_list} onChangeSelection={this.handleDbChange}/>
                  </Panel>
                </div>
                <div id="resultsTable" className="pve_resultWrapper">
                   <Results_table results={this.state.result_list}/>
                </div>
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
     }
    render() {
    var Table = ReactBootstrap.Table;
       return (
            <Table striped bordered condensed hover>
                <thead>
                    <th>Zid</th>
                    <th>Test Status</th>
                    <th>Run</th>
                </thead>
                <tbody>
                    {this.props.results.map((testcase) => (
                        <tr>
                            <td><a href={"http://jira/browse/" + testcase.zid}>{testcase.zid}</a></td>
                            <td>
                                {
                                testcase.status.map((tc_status) => {
                                    return (<div>{tc_status.passed?<span className="btn btn-sm btn-success"/>:
                                    <span className="btn btn-danger"/>}</div>
                                )
                                })
                                }
                            </td>
                            <td>{testcase.last_run}</td>
                        </tr>)
                    )}
                </tbody>
            </Table>
       );
    }
}

    ReactDOM.render(<FilterMenu/>, document.getElementById('wrapper'));

