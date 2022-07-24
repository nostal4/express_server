const Book = require('../models/Book');

class booksController {
  async getBooks(req, res) {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (e) {
      res.status(404).send('not found');
    }
  }

  async getBook(req, res) {
    try {
      const { _id } = req.params;
      const book = await Book.findOne({ _id });
      if (book._id) {
        res.send(book);
      } else {
        res.status(404).send('not found');
      }
    } catch {
      res.status(404).send('not found');
    }
  }

  async createBook(req, res) {
    try{
      if (!req.body) return res.sendStatus(400);
      const { _title, _author, _genre, _description } = req.body;
  
      const books = await Book.find();
      JSON.stringify(books);
      let titleUsed = false;
  
      for (let i = 0; i < books.length; i++) {
        if (books[i].title === _title) {
          titleUsed = true;
          break;
        }
      }
      if (!titleUsed) {
        const book = new Book({
          title: _title,
          author: _author,
          genre: _genre,
          description: _description
        });
        await book.save();
        res.send(book);
      } else {
        res.status(404).send('title is used');
      }
    }catch{
      return res.status(404).send('error');
    }    
  }

  async deleteBook(req, res) {
    try {
      const { _id } = req.params;
      const book = await Book.findByIdAndDelete({ _id });
      if (book._id) {
        res.send(book);
      } else {
        res.status(404).send('not found');
      }
    } catch {
      res.status(404).send('not found');
    }
  }

  async updateBook(req, res) {
    try{
      if (!req.body) return res.sendStatus(400);
      const { _id, _title, _author, _genre, _description } = req.body;
  
      const books = await Book.find();
      JSON.stringify(books);
      let titleUsed = false;
      for (let i = 0; i < books.length; i++) {
        if (books[i]._id != _id) {
          if (books[i].title === _title) {
            titleUsed = true;
            break;
          }
        }
      }
      if (titleUsed) {
        res.status(405).send('title is used');
      }
      else {
        Book.findByIdAndUpdate(
          { _id: _id },
          {
            title: _title,
            author: _author,
            genre: _genre,
            description: _description
          },
          { new: true },
          function (err, result) {
            if (err) {
              res.status(404).send();
            } else {
              res.send(result);
            }
          }
        );
      }
    }
    catch{
      res.status(404).send('error');
    }
    
   
  }
}

module.exports = new booksController();
