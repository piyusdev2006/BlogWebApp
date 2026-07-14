import React, { useState, useEffect } from 'react'
import { PostCard, Container } from '../components';
import dbService from '../appwriteServices/dbServices'

function AllPost() {
    const [posts, setPosts] = useState([])

  useEffect(() => {
      dbService
        .getAllPosts([])
        .then((posts) => {
          if (posts) {
            setPosts(posts.documents);
          }
        })
        .catch((error) => console.log(error));
}, [])

    
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost
