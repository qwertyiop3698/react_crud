import { useEffect, useState } from 'react';
import './App.scss';

function App() {
  const [mode, setMode] = useState('list');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [file, setFile] = useState(null);

  const saveComment = () => {
    if (!commentContent) {
      alert("댓글을 입력해주세요.");
      return;
    }
    fetch('https://toma2025.dothome.co.kr/backend/comments.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: selectedPost.id,
        content: commentContent,
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      const newComment = {
        id: data.id,
        content: commentContent,
        created_at: "방금 전"
      }
      setComments([newComment, ...comments]);
      setCommentContent('');
    })
    .catch(err => alert('저장 실패 : ' + err));
  };

  const save = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (file && file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        formData.append('image[]', file[i]);
      }
    }

    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    fetch('https://toma2025.dothome.co.kr/backend/write.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetch('https://toma2025.dothome.co.kr/backend/posts.php')
        .then(res => res.json())
        .then(newData => {
          setPosts(newData);
          setMode('list');
          setTitle('');
          setContent('');
          setFile(null);
        });
    })
    .catch(err => alert('저장 실패 : ' + err));
  };

  useEffect(() => {
    fetch('https://toma2025.dothome.co.kr/backend/posts.php')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("데이터 로드 실패:", err));
  }, []);

  const getComments = (id) => {
    fetch(`https://toma2025.dothome.co.kr/backend/get_comments.php?post_id=${id}`)
    .then(res => res.json())
    .then(data => setComments(data))
    .catch(err => console.error("데이터로드 실패:", err))
  };

  const deletePost = () => {
    if (!window.confirm("정말로 이 글을 삭제하시겠습니까?")) return;
    fetch(`https://toma2025.dothome.co.kr/backend/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPost.id }),
    })
    .then(res => res.json())
    .then((data) => {
      alert(data.message);
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setMode('list');
    })
    .catch(err => console.error("삭제 실패:", err))
  }

  const deleteComment = (id) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    fetch(`https://toma2025.dothome.co.kr/backend/delete_comment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
    .then(res => res.json())
    .then((data) => {
      alert(data.message);
      setComments(comments.filter(c => c.id !== id));
    })
    .catch(err => console.error("삭제 실패:", err))
  }

  const update = () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해야 수정이 가능합니다.');
      return;
    }
    fetch('https://toma2025.dothome.co.kr/backend/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        id: selectedPost.id
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id ? { ...post, title: title, content: content } : post
      );
      setPosts(updatedPosts);
      setMode('list');
      setTitle('');
      setContent('');
    })
    .catch(err => alert('수정 실패 : ' + err));
  };

  return (
    <div className='App'>
      <h1 onClick={() => setMode('list')}>자유 게시판</h1>
      <hr />

      {mode === 'list' && (
        <div className='list-container'>
          <button onClick={() => setMode('write')}>새 글 쓰기</button>
          {posts.map(post => (
            <div 
              className='post-card'
              key={post.id} 
              onClick={() => {
                setSelectedPost(post);
                setMode('detail');
                getComments(post.id);
                fetch('https://toma2025.dothome.co.kr/backend/views.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: post.id })
                });
                const updatedPosts = posts.map(item => item.id === post.id ?
                  { ...item, views: Number(item.views) + 1 } : item
                );
                setPosts(updatedPosts);
                setSelectedPost(updatedPosts.find(it => it.id === post.id));
              }} 
            >
              <div className="post-item">
                <span className="post-title">{post.title}</span>
                <span className="post-views">조회수: {post.views}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {mode === 'detail' && selectedPost && (
        <div>
          <div className="detail-container">
            <h2>{selectedPost.title}
              <span className='detail-views'> 조회수: {selectedPost.views}</span>
            </h2>
            <hr />
            <p>{selectedPost.content}</p>
            {selectedPost.image_path && selectedPost.image_path.split(',').map((img, index) => (
              <img 
                key={index} 
                src={"https://toma2025.dothome.co.kr/backend/uploads/" + img} 
                alt={`포스트 이미지 ${index}`}
                className="detail-image" 
              />
            ))}
            <br/>
            <small>작성일: {selectedPost.created_at}</small>
            <br/><br/>
            <button onClick={() => setMode('list')}>목록으로</button>
            <button onClick={() => {
              setMode('edit');
              setTitle(selectedPost.title);
              setContent(selectedPost.content);
            }}>수정하기</button>
            <button onClick={deletePost}>삭제하기</button>
            <div className='detail-write-comment'>
              <textarea
                placeholder='댓글을 입력하세요.'
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
              ></textarea>
              <button onClick={saveComment}>댓글 등록</button>
            </div>
          </div>
          <h3>댓글 목록</h3>
          <div>
            {comments.map(item => (
              <div className='comments-list' key={item.id}>
                <strong>익명</strong>: {item.content}
                <br/>
                <small>{item.created_at}</small>
                <button onClick={() => deleteComment(item.id)}>삭제</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'write' && (
        <div className="form-container">
          <h2>새 글 작성</h2>
          <input className='form-input' type="text" placeholder="제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} />
          <br/><br/>
          <textarea className='form-textarea' placeholder="내용을 입력하세요." value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          <br/><br/>
          <input multiple className='form-fileuploads' type="file" accept="image/*" onChange={(e) => setFile(e.target.files)} />
          <button onClick={save}>저장</button>
          <button onClick={() => setMode('list')}>취소</button>
        </div>
      )}

      {mode === 'edit' && (
        <div className="form-container">
          <h2>게시글 수정</h2>
          <input className='form-input' value={title} onChange={(e) => setTitle(e.target.value)} />
          <br/><br/>
          <textarea className='form-textarea' value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          <br/><br/>
          <button onClick={update}>수정 완료</button>
          <button onClick={() => setMode('detail')}>취소</button>
        </div>
      )}
    </div>
  );
}

export default App;