// styles/DatePickerStyles.ts
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { theme } from "@/styles/theme";

type PickerType = "small" | "default";

interface ItemPickerProps {
  items: string[];
  defaultItem?: string;
  unit: string;
  onChange: (item: string) => void;
  type?: PickerType;
  scrollToItem?: string;
}

const NewItemPicker: React.FC<ItemPickerProps> = ({
  items,
  defaultItem,
  unit,
  onChange,
  type = "default",
  scrollToItem,
}) => {
  const initialItem = defaultItem || items[0];
  const [selectedItem, setSelectedItem] = useState<string>(initialItem);
  const refContainer = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const itemElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isTouchScrolling, setIsTouchScrolling] = useState(false);

  const scrollToSelectedItem = (item: string) => {
    const index = items.indexOf(item);
    const currentElement = itemElementsRef.current[index];
    if (currentElement && refContainer.current && !isTouchScrolling) {
      const offsetTop = currentElement.offsetTop;
      const scrollPosition =
        offsetTop -
        refContainer.current.offsetHeight / 2 +
        currentElement.offsetHeight / 2;

      refContainer.current.scrollTop = scrollPosition;
    }
  };

  useEffect(() => {
    scrollToSelectedItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemStr = entry.target.getAttribute("data-item");
            if (itemStr) {
              setSelectedItem(itemStr);
              onChange(itemStr);
            }
          }
        });
      },
      {
        root: refContainer.current,
        rootMargin: `-60px 0px -60px 0px`,
        threshold: 0.8,
      }
    );

    const elements = itemElementsRef.current.filter(Boolean);
    elements.forEach((elem) => observer.current?.observe(elem!));

    return () => {
      elements.forEach((elem) => observer.current?.unobserve(elem!));
      observer.current?.disconnect();
    };
  }, [items, onChange]);

  useEffect(() => {
    if (scrollToItem && items.includes(scrollToItem)) {
      scrollToSelectedItem(scrollToItem);
    }
  }, [scrollToItem, items]);

  //   useEffect(() => {
  //     console.log("현재 선택된 아이템:", selectedItem);
  //   }, [selectedItem]);

  // 터치 스크롤이 끝난 후 현재 중앙 아이템을 다시 확인하는 로직
  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsTouchScrolling(false);

      if (refContainer.current) {
        const middleY =
          refContainer.current.scrollTop +
          refContainer.current.offsetHeight / 2;
        const selectedElement = itemElementsRef.current.find(
          (element) =>
            element &&
            element.offsetTop <= middleY &&
            element.offsetTop + element.offsetHeight > middleY
        );
        if (selectedElement) {
          const itemStr = selectedElement.getAttribute("data-item");
          if (itemStr) {
            setSelectedItem(itemStr);
            onChange(itemStr);
          }
        }
      }
    }, 200); // 약간의 딜레이를 주어 터치 스크롤이 끝난 후에 다시 확인
  };

  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchScrolling(true);
    };

    refContainer.current?.addEventListener("touchstart", handleTouchStart);
    refContainer.current?.addEventListener("touchend", handleTouchEnd);

    return () => {
      refContainer.current?.removeEventListener("touchstart", handleTouchStart);
      refContainer.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <ItemPickerContainer ref={refContainer}>
      {items.map((item, index) => (
        <Item
          key={index}
          ref={(el) => {
            itemElementsRef.current[index] = el;
          }}
          data-item={item}
          $isSelected={item === selectedItem}
          $type={type}
          whileTap={{ scale: 0.95 }}
        >
          {item}
          {unit}
        </Item>
      ))}
    </ItemPickerContainer>
  );
};

export default NewItemPicker;

const ItemPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
  gap: 15px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  padding-top: 70px;
  padding-bottom: 70px;
  scrollbar-width: none;
  z-index: 10;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled(motion.div)<{ $isSelected: boolean; $type: PickerType }>`
  flex: 0 0 auto;
  height: 60px;
  width: ${({ $type }) => ($type === "small" ? "65px" : "85px")};
  box-sizing: border-box;
  padding: 10px 0;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  scroll-snap-align: center;
  font-weight: ${({ $isSelected }) => ($isSelected ? "500" : "400")};
  font-size: ${({ $isSelected, $type }) =>
    $isSelected
      ? $type === "small"
        ? "20px"
        : "24px"
      : $type === "small"
      ? "16px"
      : "20px"};
  color: ${({ $isSelected }) => ($isSelected ? "white" : theme.colors.gray600)};
  transition: color 0.7s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
