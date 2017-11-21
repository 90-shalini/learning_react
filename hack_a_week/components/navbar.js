    const NavFunc = () => {
            return(
                <div className="planview_container">
                    <nav className="navbar navbar-inverse">
                        <div className="navbar-header">
                            <img src="../images/planview_logo.png" height="50px"/>
                            <i className="fa fa-cogs navbar-brand"></i>
                        </div>
                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                              <li className="dropdown">
                                <a className="dropdown-toggle" data-toggle="dropdown" href="#">Analytics
                                    <span className="caret"></span>
                                </a>
                                <ul className="dropdown-menu">
                                  <li><a href="/">Performance</a></li>
                                  <li><a href="/sameness">Sameness</a></li>
                                </ul>
                              </li>
                              <li className="dropdown">
                                <a className="dropdown-toggle" data-toggle="dropdown" href="#">Integration
                                    <span className="caret"></span>
                                 </a>
                                <ul className="dropdown-menu">
                                  <li><a href="/integration/rally">Rally</a></li>
                                  <li><a href="/integration/projectplace">Projectplace</a></li>
                                </ul>
                              </li>
                              <li><a href="/progressing">Progressing</a></li>
                              <li><a href="/ui">UI</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
                );
        }
  ReactDOM.render(
      <NavFunc/>, document.getElementById('pve_navbar')
      )