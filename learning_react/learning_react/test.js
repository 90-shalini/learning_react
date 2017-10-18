const Env = (props) => {
    return(
        <div>
            <ul>
                <span>Select Environment</span>
                <li>
                    <a href="#">Test</a>
                </li>
            </ul>
        </div>
    );
};

ReactDOM.render(<Env />, document.getElementById('root'));