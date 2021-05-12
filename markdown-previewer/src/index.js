import React from 'react';
import {render} from 'react-dom';
import showdown from 'showdown';
import {SampleMD} from './Data';

const converter = new showdown.Converter({
    strikethrough: true,
    tables: true
});

class MarkdownPreviewer extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            value: SampleMD
        };
    }
    
    handleChange(e) {
        this.setState({value: e.target.value});
    }
    
    render () {
        const {value} = this.state;
        const md = {__html: converter.makeHtml(value)};
        return (
            <div className="row">
                <div className="col-sm-6 md-editor">
                    <textarea
                        value={value} 
                        className="form-control" 
                        onChange={(e) => this.handleChange(e)}></textarea>
                </div>
                <div className="col-sm-6 col-sm-offset-6">
                    <div dangerouslySetInnerHTML={md} />
                </div>
            </div>
        )
    }
}

render(<MarkdownPreviewer/>, document.getElementById('app'));
