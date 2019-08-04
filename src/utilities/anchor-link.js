import React from 'react';

class AnchorLink extends React.Component {
  constructor(props) {
    super(props);
    this.jumpTo = this.jumpTo.bind(this);
  }

  jumpTo() {
    const targetElement = document.getElementById(this.props.location);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <a
        href
        onClick={this.jumpTo}
        className="downArrow"
        aria-label="down arrow"
      >
        <i></i>
      </a>
    );
  }
}

export default AnchorLink;
