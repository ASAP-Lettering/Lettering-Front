"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import { useToast } from "@/hooks/useToast";

const LetterRegisterPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [sender, setSender] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [letterState, setLetterState] = useRecoilState(registerLetterState);
  const [isToastShown, setIsToastShown] = useState(false);

  const handleSenderChange = (newValue: string) => {
    setSender(newValue);
  };

  const handleContentChange = (newValue: string) => {
    if (newValue.length <= 1000) {
      setContent(newValue);
    }
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages: File[] = Array.from(files).slice(0, 4);
      const totalImages = images.length + selectedImages.length;

      /* 토스트 메세지 이미 보여짐 */
      if (isToastShown) {
        if (totalImages >= 4) {
          setIsButtonDisabled(true);
          setImages((prevImages) =>
            [...prevImages, ...selectedImages].slice(0, 4)
          );
          return;
        }

        if (totalImages > 4) {
          const additionalImagesNeeded = 4 - images.length;
          const newImages = [
            ...images,
            ...selectedImages.slice(0, additionalImagesNeeded),
          ];
          setImages(newImages);
          return;
        }
      } else {
        /* 토스트 메세지 보여지기 전*/
        if (totalImages > 4) {
          showToast("사진 첨부는 최대 4장까지 가능해요.", {
            icon: true,
            close: false,
            bottom: "113px",
          });
          setIsToastShown(true);
          setIsButtonDisabled(true);
          const newImages = [
            ...images,
            ...selectedImages.slice(0, 4 - images.length),
          ];
          setImages(newImages);
          return;
        }
      }

      setIsButtonDisabled(false);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleDeleteImages = (id: number) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== id));
  };

  const handleAddNext = () => {
    /* 다음 페이지 */
    setLetterState({
      senderName: sender,
      content: content,
      images: images.map((img) =>
        img instanceof File ? URL.createObjectURL(img) : img
      ), // 이미지 URL로 저장
      templateType: 0,
    });
    router.push("/letter/template");
  };

  return (
    <Layout>
      <NavigatorBar title="새 편지 등록하기" cancel={false} />
      <Container>
        <Essential>* 필수</Essential>
        <Column>
          <Label>편지를 보낸 사람은 누구인가요? *</Label>
          <Input
            inputType="boxText"
            value={sender}
            onChange={handleSenderChange}
            placeholder="ex) 홍길동"
          />
        </Column>
        <Column>
          <Label>
            편지 텍스트 또는 사진을 붙여주세요 *
            <Count>
              <Span>{content.length}</Span>
              /1000
            </Count>
          </Label>
          <Input
            inputType="boxTextArea"
            value={content}
            onChange={handleContentChange}
            placeholder="최대 1000자까지 입력이 가능해요"
            height="228px"
          />
          {images.length === 0 ? (
            <AddImageLabel>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                style={{ display: "none" }}
              />
              + 사진 불러오기 (선택)
            </AddImageLabel>
          ) : (
            <ImagesList>
              <AddImagesLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  style={{ display: "none" }}
                  disabled={isButtonDisabled}
                />
                +<br />
                {images.length}/4
              </AddImagesLabel>
              <ImagesWrapper>
                {images.map((image, index) => (
                  <ImageDiv>
                    <Image
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      width={52}
                      height={52}
                      alt="images"
                      style={{ borderRadius: "8px" }}
                    />
                    <DeleteIcon onClick={() => handleDeleteImages(index)}>
                      <Image
                        src="/assets/icons/ic_image_delete.svg"
                        width={20}
                        height={20}
                        alt="delete"
                      />
                    </DeleteIcon>
                  </ImageDiv>
                ))}
              </ImagesWrapper>
            </ImagesList>
          )}
        </Column>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text="다음"
            disabled={!sender || (!content && !images)}
            onClick={handleAddNext}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default LetterRegisterPage;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 20px 20px 20px 20px;
  background-color: ${theme.colors.bg};
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Essential = styled.div`
  text-align: right;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption03};
  margin-bottom: 17px;
`;

const Column = styled.div`
  margin-bottom: 40px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 20px;
`;

const Count = styled.div`
  display: flex;
  color: ${theme.colors.gray400};
  ${theme.fonts.body09};
`;

const Span = styled.span`
  color: ${theme.colors.white};
`;

const AddImageLabel = styled.label`
  width: 100%;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  border-radius: 12px;
  background: ${theme.colors.gray700};
  color: ${theme.colors.gray400};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  ${theme.fonts.body08}
  margin-top: 16px;
`;

const AddImagesLabel = styled.label`
  width: 52px;
  height: 52px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: ${theme.colors.gray700};
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.body08};
  text-align: center;
`;

const ImagesList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
`;

const ImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 13px;
`;

const ImageDiv = styled.div`
  width: 52px;
  height: 52px;
  position: relative;
`;

const DeleteIcon = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  right: -5px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
