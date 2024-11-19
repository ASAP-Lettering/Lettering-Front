"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import { useToast } from "@/hooks/useToast";
import { postImage } from "@/api/image/image";
import imageCompression from "browser-image-compression";
import Loader, { LoaderContainer } from "@/components/common/Loader";

const LetterRegisterPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [sender, setSender] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]); // 서버 전송용
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기용
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 서버 이미지 업로드 상태
  const [loadingResolved, setLoadingResolved] = useState(false); // 로딩 플래그

  const [letterState, setLetterState] = useRecoilState(registerLetterState);
  const [isToastShown, setIsToastShown] = useState(false);
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const independent = searchParams.get("independent");

  useEffect(() => {
    if (letterState) {
      setSender(letterState.senderName);
      setContent(letterState.content);
      setImages(letterState.images);
      setPreviewImages(letterState.previewImages);
    }
  }, [letterState]);

  const handleSenderChange = (newValue: string) => {
    setSender(newValue);
  };

  const handleContentChange = (newValue: string) => {
    const maxLength = 1000;
    if (newValue.length > maxLength) {
      setContent(newValue.substring(0, maxLength));
    } else {
      setContent(newValue);
    }
  };

  const handleShowToast = () => {
    /* 토스트 메세지 보여지기 전*/
    if (previewImages.length >= 4 && !isToastShown) {
      showToast("사진 첨부는 최대 4장까지 가능해요.", {
        icon: true,
        close: false,
        bottom: "113px",
      });
      setIsToastShown(true);
    }
  };

  const handleAddImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const selectedImages: File[] = Array.from(files);
      const totalImages = (previewImages || []).length + selectedImages.length;
      console.log("Total Images:", totalImages);

      if (totalImages > 4) {
        const additionalImagesNeeded = 4 - (previewImages || []).length;
        const newImages = [
          ...(previewImages || []),
          ...selectedImages
            .slice(0, additionalImagesNeeded)
            .map((file) => URL.createObjectURL(file)),
        ];
        setPreviewImages(newImages);
        /* 토스트 메세지 보여지기 전*/
        showToast("사진 첨부는 최대 4장까지 가능해요.", {
          icon: true,
          close: false,
          bottom: "113px",
        });
        if (!isToastShown) {
          console.log("여기");
          showToast("사진 첨부는 최대 4장까지 가능해요.", {
            icon: true,
            close: false,
            bottom: "113px",
          });
          console.log("실행");
          setIsToastShown(true);
        }
        return;
      }

      setIsButtonDisabled(false);

      /* 클라이언트에서 미리보기를 위한 URL 설정 */
      const previewUrls = selectedImages?.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prevImages) => [...(prevImages || []), ...previewUrls]);

      const imageUrls: string[] = [];
      for (const file of selectedImages) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });

        try {
          setIsLoading(true);

          const response = await postImage(compressedFile);
          console.log("이미지 업로드 성공", response.data);
          imageUrls.push(response.data.imageUrl);
        } catch (error) {
          console.error("이미지 업로드 실패", error);
        }
      }
      setImages((prevImages) => [...prevImages, ...imageUrls]);
      setIsLoading(false);
    }
  };

  const handleDeleteImages = (id: number) => {
    if (previewImages.length - 1 < 4) {
      setIsButtonDisabled(false);
    }
    setImages((prevImages) => prevImages.filter((_, index) => index !== id));
    setPreviewImages((prevImages) =>
      prevImages.filter((_, index) => index !== id)
    );
  };

  useEffect(() => {
    // console.log("images", images);
    // console.log("previewImages", previewImages);
  }, [images, previewImages]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingResolved(true); // 로딩 완료 플래그
    }
  }, [isLoading]);

  const handleAddNext = async () => {
    /* 다음 페이지 */
    if (isLoading) {
      // 로딩 완료될 때까지 대기
      while (!loadingResolved) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    /* 로딩(서버 URL 반환)이 끝난 뒤, 이후 코드 실행 */
    setLetterState((prevState) => ({
      ...prevState,
      senderName: sender,
      content: content,
      images: images,
      previewImages: previewImages,
    }));
    console.log("저장완료");
    if (letterId) {
      if (independent === "true") {
        router.push(`/letter/template?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/letter/template?letterId=${letterId}`);
      }
    } else {
      router.push("/letter/template");
    }
  };

  return (
    <Layout>
      <NavigatorBar
        title={letterId ? "편지 수정하기" : "새 편지 등록하기"}
        cancel={false}
      />
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
          {(previewImages || []).length === 0 ? (
            // {images.length === 0 ? (
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
              <AddImagesLabel onClick={handleShowToast}>
                {previewImages.length < 4 && (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    style={{ display: "none" }}
                    disabled={isButtonDisabled}
                  />
                )}
                +<br />
                {/* {images.length}/4 */}
                {previewImages.length}/4
              </AddImagesLabel>
              <ImagesWrapper>
                {/* {images.map((image, index) => ( */}
                {previewImages.map((image, index) => (
                  <ImageDiv>
                    <Image
                      src={image}
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
            disabled={!sender || (!content && previewImages?.length === 0)}
            onClick={handleAddNext}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default function LetterRegisterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterRegisterPage />
    </Suspense>
  );
}

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
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Essential = styled.div`
  text-align: right;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption03};
  margin-top: 25px;
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
  margin-bottom: 100px;
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
  margin-bottom: 100px;
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
  padding: 0px 20px;
  bottom: 40px;
  left: 0;
`;
