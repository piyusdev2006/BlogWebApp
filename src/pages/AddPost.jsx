import React from 'react'
import { PostForm , Container} from '../components';

function AddPost() {
  return (
    <div className='py-10 md:py-16 page-enter'>
      <Container>
        <div className="mb-8">
          <p className="text-eyebrow text-primary uppercase tracking-widest mb-2">
            New Post
          </p>
          <h1 className="text-headline text-ink font-display">
            Create a new post
          </h1>
        </div>
        <PostForm />
      </Container>
    </div>
  )
}

export default AddPost