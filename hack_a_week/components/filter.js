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
                    console.log(response.data);
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
   console.log(results_url)
   axios.get(results_url)
        .then(response => {
            console.log(response.data);
            this.setState({result_list: response.data})
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
                console.log(response.data);
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
             <div id="accordion" class="panel panel-lg panel-custom">
              <Button onClick={() => this.setState({ open: !this.state.open })}>
                     <Glyphicon bsStyle="Info" className="glyphicon" glyph="filter"/>
              </Button>
              <Panel collapsible defaultExpanded expanded={this.state.open}>
                <div>
                    <Env_dropdown envs={this.state.env_list} onChangeSelection={this.handleEnvChange}/>
                    <DB_dropdown db={this.state.db_list} onChangeSelection={this.handleDbChange}/>
                    <Results_table results={this.state.result_list}/>
                </div>
              </Panel>
             </div>
         );
   }
}

class Env_dropdown extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props);
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
        console.log(this.props);
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
                console.log('In results table')
                this.state = {
                    results: [props.results]
                };
                console.log(this.state.results)
            }
            render() {
       let Table = ReactBootstrap.Table;
       var resultsRow = this.props.results.map((result_row) => {
            return
       })
       return (
           <div id="column_data">
               <Table ref='table1' className="striped bordered condensed hover">
                    <TableHeaderColumn dataField='zid' isKey={ true } dataSort={ true }>Zephyr ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='descr'>Description</TableHeaderColumn>
                    <TableHeaderColumn dataField='status'>Test Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='last_run'>Last Run</TableHeaderColumn>
               </Table>
            </div>
        );
    }
        }

    ReactDOM.render(<FilterMenu/>, document.getElementById('filter'));

