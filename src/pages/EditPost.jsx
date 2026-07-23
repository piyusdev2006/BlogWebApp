import React, { useEffect, useState } from 'react'
import { PostForm, Container } from '../components';
import dbService from '../appwriteServices/dbServices'
import { useParams, useNavigate } from 'react-router';

function EditPost() {
    const [post, setPost] = useState(null);

    // we need slug also and we get it from the url params
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            dbService.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPost(post);
                    }
             })
        }
        else {
            navigate('/');
        }
    }, [slug, navigate]);
    
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className='py-10 md:py-16 page-enter'>
      <Container>
        <div className="mb-8">
          <p className="text-eyebrow text-primary uppercase tracking-widest mb-2">
            Editing
          </p>
          <h1 className="text-headline text-ink font-display">
            Edit post
          </h1>
        </div>
        <PostForm post={post} />
      </Container>
    </div>
  );
}

export default EditPost
