class FilterMenu extends React.Component {
   constructor() {
     super();
     this.state={open: true,
      env_list: [],
      db_list: [],
      selectedEnvironment: ''};
   }

   handleChange = (event) => {
    this.setState(
                {selectedEnvironment : event.target.value}
                );
    var db_list_url = 'http://'+window.location.hostname+':5000/ui/'+ this.state.selectedEnvironment;
    axios.get(db_list_url)
            .then(response => {
                console.log(response.data);
                this.setState({db_list: response.data})
             })
            .catch(function (error){
                console.log(error)
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
                    <Env_dropdown envs={this.state.env_list} onChangeSelection={this.handleChange}/>
                    <DB_dropdown db={this.state.db_list}/>
                </div>
              </Panel>
             </div>
         );
   }
}

class Env_dropdown extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props)
    };
    render(){
         var envOptions = this.props.envs.map((env) =>{
            return <option>{env.pve_env}</option>
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
            return <option>{db_name.pve_dsn}</option>
         })
        return (<div className="ProductFilter__section-container">
                   <label>Database</label>
                   <select id="db_dropdown">
                        {dbOptions}
                   </select>
                </div>);
    }
}
    ReactDOM.render(<FilterMenu/>, document.getElementById('filter'));
