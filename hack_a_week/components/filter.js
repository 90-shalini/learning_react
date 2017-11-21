class FilterMenu extends React.Component {
   constructor() {
     super();
     this.state={open: true, envs: [], db: [], selectedEnvironment: ''};
   }
   handleChange = (event) => {
    this.setState({selectedEnvironment : event.target.value});
    console.log(this.state.selectedEnvironment)
    var db_list_url = 'http://'+window.location.hostname+':5000/ui/'+ this.state.selectedEnvironment;
    var db_element = document.getElementById('db_dropdown').options;
    axios.get(db_list_url)
            .then(response => {
                console.log(response.data);
                response.data.forEach((option) => this.state.db.add(new Option(
                option.pve_dsn)));
                db_element.selected(response.data[0])
             })
            .catch(function (error){
                console.log(error)
            });

   }
   componentDidMount(){
    var env_list_url = 'http://'+window.location.hostname+':5000/ui';
    var env_element = document.getElementById('env_dropdown').options;
    axios.get(env_list_url)
            .then(response => {
                console.log(response.data);
                this.setState({envs: this.state.envs.concat(response.data)})
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
                <Env_dropdown envs={this.state.envs} onChangeSelection ={this.handleChange}/>
                <DB_dropdown db={this.state.db}/>
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
        <div className="ProductFilter__section-container">
                   <label>Environment</label>
                   <select id="env_dropdown" onChange={(event) => this.props.onChangeFunction(event)}>
                   {this.props.envs.map(env => <Option key={env.name}{...env}/>
                                )}
                   </select>
                </div>
    }
}

const Option = (props) => {
        return ( <option>{props.name}</option>
        );
    };

class DB_dropdown extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props);
    };
    render(){
        <div className="ProductFilter__section-container">
                   <label>Database</label>
                   <select id="db_dropdown" onChange={(event) => this.props.onChangeFunction(event)}>
                   {this.props.db.map(db_name => <Option key={db_name.pve_dsn}{...db_name}/>
                                )}
                   </select>
                </div>
    }
}
ReactDOM.render(<FilterMenu/>, document.getElementById('filter'));
