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
    
  return post ? (
      <div className='py-8'>
          <Container>
              <PostForm post={post} />
          </Container>
      </div>
  ) : null;
}

export default EditPost
