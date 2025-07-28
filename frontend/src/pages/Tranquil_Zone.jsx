import React from "react";
import "./Tranquil_Zone.css";

export default function TranquilZone() {
  const books = [
    {
      title: "The Power of Now",
      author: "Eckhart Tolle",
      image: "/assets/books/The power of now.jpeg",
      link: "https://archive.org/download/ThePowerOfNowEckhartTolle_201806/The%20Power%20Of%20Now%20-%20Eckhart%20Tolle.pdf",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      image: "/assets/books/81F90H7hnML.jpg",
      link: "https://archive.org/details/atomic-habits-pdfdrive",
    },
    {
      title: "Ikigai",
      author: "Héctor García and Francesc Miralles",
      image: "/assets/books/81l3rZK4lnL._UF894,1000_QL80_.jpg",
      link: "https://dn790007.ca.archive.org/0/items/ikigai-the-japanese-secret-to-a-long-and-happy-life-pdfdrive.com/Ikigai%20_%20the%20Japanese%20secret%20to%20a%20long%20and%20happy%20life%20%28%20PDFDrive.com%20%29.pdf",
    },
  ];

  const videos = [
    {
      title: "10-Minute Meditation",
      thumbnail: "/assets/videos/images.jpeg",
      url: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
    },
    {
      title: "The Science Of Building EXTREME Discipline ",
      thumbnail: "/assets/videos/hq720.avif",
      url: "https://youtu.be/AtbkxxoTrYk?si=5KZ0DkVRwXa8Rp9k",
    },
  ];

  return (
    <div className="tranquil-zone">
      <h1 className="zone-title">🧘 Tranquil Zone</h1>
      <p className="zone-description">
        A calming space to unwind, grow, and reset your mind.
      </p>

      <div className="cards-container">
        {/* Soothing Sessions FIRST */}
        <div className="card">
          <h2 className="card-title">🎥 Soothing Sessions</h2>
          <div className="media-grid">
            {videos.map((video, index) => (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="media-card"
                key={index}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="media-image"
                />
                <div className="media-info">
                  <strong>{video.title}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Wisdom Shelf SECOND */}
        <div className="card">
          <h2 className="card-title">📚 Wisdom Shelf</h2>
          <div className="media-grid">
            {books.map((book, index) => (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="media-card"
                key={index}
              >
                <img src={book.image} alt={book.title} className="media-image" />
                <div className="media-info">
                  <strong>{book.title}</strong>
                  <p className="author">by {book.author}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
