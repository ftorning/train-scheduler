# Project Starter Template

Provides project structure, links for tools used in class, and some boilerplate code.

Links / Scripts will be updated as we begin using new tools.

## Getting Started

1. Clone this repository to your local computer

2. Copy the directory for your new project

  ```
  $ cp -r project-template ./[my-new-project]
  ```

3. Delete the `.git` file from the new directory root

  ```
  $ rm -R ./[my-new-project]/.git
  ```

4. git init a new repository in the new directory

  ```
  $ cd ./[my-new-project]
  $ git init
  ```

5. IMPORTANT - Create a credentials file in your js directory

  ```
  $ touch ./assets/js/credentials.js
  ```

  Note that this file is included in .gitignore and will not be pushed to Github 

  If you are using Firebase, include the following in the credentials.js file

  ```
  var firebaseConfig = {
      
      // copy/paste the below information from Firebase

      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
    };
  ```

6. Delete or comment out any references to CSS or JS packages you are not using to cut down on load

## Contributing

If you believe something was left out, feel free to fork and sumbit a pull request

## Author

**Fraser Torning** - *Initial work* - [ftorning](https://github.com/ftorning)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details