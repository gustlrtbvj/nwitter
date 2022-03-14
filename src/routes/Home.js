import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL} from "@firebase/storage";
import React, { useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet";


const Home = ({ userObj }) => {

    const fileInput = useRef();
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("")



    useEffect(() => {
        // 실시간으로 데이터를 데이터베이스에서 가져오기
        const q = query(
        collection(getFirestore(), 'nweets'),
        // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
        orderBy('createdAt',"desc")
        );
        const unsubscribe = onSnapshot(q, querySnapshot => {
        const newArray = querySnapshot.docs.map(doc => {
        return {
        id: doc.id,
        ...doc.data(),
        };
        });
        setNweets(newArray);
        console.log('Current tweets in CA: ', newArray);
        });
        return () => {
        unsubscribe();
        };
        }, []);
        
        const onSubmit = async (event) => {
          event.preventDefault();
          let attachmentUrl = "";
          if (attachment !== "") {
          //파일 경로 참조 만들기
          const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
          //storage 참조 경로로 파일 업로드 하기
          const uploadFile = await uploadString(fileRef, attachment, "data_url");
          console.log(uploadFile);
          //storage에 있는 파일 URL로 다운로드 받기
          attachmentUrl = await getDownloadURL(uploadFile.ref);
          }
          
          //트윗할때, 메시지와 사진도 같이 firestore에 생성
          const nweetObj = {
          text: nweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl,
          };
          await addDoc(collection(dbService, "nweets"), nweetObj);
          setNweet("");
          setAttachment("");
          fileInput.current.value = ""; 
        };

    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNweet(value);
    };
    
    const onFileChange = (event) => {
        const {
          target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
              } = finishedEvent;
              setAttachment(result);
        };
        reader.readAsDataURL(theFile);
      };

      
      const onClearAttachment = () => { 
        setAttachment("");
        fileInput.current.value = ""; 
      };


    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
          <input type="submit" value="Nweet" />
          {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
        </form>
        <div>
        {nweets.map((nweet) => (
          <Nweet
          key={nweet.id}
          nweetObj={nweet}
          isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
      </div>
    );
  };
export default Home; 