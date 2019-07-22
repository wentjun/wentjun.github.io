import React from 'react';

import AnchorLink from '../utilities/anchor-link.js';
import contactStyles from './contact.module.css';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      errors: {
        name: '',
        email: '',
        message: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    // event.preventDefault();
    const emailRegex = RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const { name, email, message } = this.state;
    let {
      name: nameErrorMessage,
      email: emailErrorMessage,
      message: messageErrorMessage,
    } = this.state.errors;

    if (name.length < 1) {
      nameErrorMessage = 'This field cannot be empty.';
    } else {
      nameErrorMessage = '';
    }

    if (email.length < 1) {
      emailErrorMessage = 'This field cannot be empty.';
    } else if (!emailRegex.test(email)) {
      emailErrorMessage = 'Please enter a valid email.';
    } else {
      emailErrorMessage = '';
    }

    if (message.length < 1) {
      messageErrorMessage = 'This field cannot be empty.';
    } else {
      messageErrorMessage = '';
    }

    this.setState({
      errors: {
        name: nameErrorMessage,
        email: emailErrorMessage,
        message: messageErrorMessage,
      },
    });
    if (nameErrorMessage || emailErrorMessage || messageErrorMessage) {
      event.preventDefault();
      return;
    } else {
      return;
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <section className={contactStyles.contact__cover}>
          <div className={contactStyles.contact__contentQuote}>
            <header>
              <span>Your greatest dreams are all on the other side of </span>
              <span>the wall of fear and caution</span>
            </header>
          </div>
          <AnchorLink location="contact" />
        </section>
        <section
          id="contact"
          className={`wrapper ${contactStyles.contact__formWrapper}`}
        >
          <div className="container">
            <header className="text-center">
              <h2>Say Hello</h2>
              <p>I'd love to hear from you</p>
            </header>
            <form
              onSubmit={this.handleSubmit}
              action="https://formspree.io/wentjun@u.nus.edu"
              method="post"
            >
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <input
                    type="text"
                    placeholder="Your name"
                    name="name"
                    onChange={event =>
                      this.setState({ name: event.target.value })
                    }
                  ></input>
                  {errors.name.length > 0 && (
                    <span className="error">{errors.name}</span>
                  )}
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <input
                    type="email"
                    placeholder="Your email"
                    name="_replyto"
                    onChange={event =>
                      this.setState({ email: event.target.value })
                    }
                  ></input>
                  {errors.email.length > 0 && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <input
                    type="text"
                    placeholder="Subject"
                    name="_subject"
                    onChange={event =>
                      this.setState({ subject: event.target.value })
                    }
                  ></input>
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Your message"
                    onChange={event =>
                      this.setState({ message: event.target.value })
                    }
                  ></textarea>
                  {errors.message.length > 0 && (
                    <span className="error">{errors.message}</span>
                  )}
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <button type="submit" value="Send">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default Contact;
