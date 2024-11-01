// styles/DatePickerStyles.ts
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { theme } from "@/styles/theme";

interface ItemPickerProps {
  items: string[];
  defaultItem?: string;
  unit: string;
  onChange: (item: string) => void;
}

interface ItemProps {
  isSelected: boolean;
}

const ItemPicker: React.FC<ItemPickerProps> = ({
  items,
  defaultItem,
  unit,
  onChange,
}) => {
  const initialItem = defaultItem || items[0];
  const [selectedItem, setSelectedItem] = useState<string>(initialItem);
  const refContainer = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const itemElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const halfItemHeight = 10;
  const observerOptions = {
    root: refContainer.current,
    rootMargin: `-${halfItemHeight}px 0px -${halfItemHeight}px 0px`,
    threshold: 0.8,
  };

  useEffect(() => {
    const index = items.indexOf(selectedItem);
    const currentElement = itemElementsRef.current[index];
    if (currentElement && refContainer.current) {
      const offsetTop = currentElement.offsetTop;
      const scrollPosition =
        offsetTop -
        refContainer.current.offsetHeight / 2 +
        currentElement.offsetHeight / 2;
      refContainer.current.scrollTop = scrollPosition;
    }
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const itemStr = entry.target.getAttribute("data-item");
          if (itemStr) {
            setSelectedItem(itemStr);
            onChange(itemStr);
          }
        }
      });
    }, observerOptions);

    itemElementsRef.current.forEach((elem) => {
      if (elem) observer.current?.observe(elem);
    });

    return () => {
      itemElementsRef.current.forEach((elem) => {
        if (elem) observer.current?.unobserve(elem);
      });
      observer.current?.disconnect();
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
          as={motion.div}
          data-item={item}
          $isSelected={item === selectedItem}
          whileTap={{ scale: 0.95 }}
        >
          {item}
          {unit}
        </Item>
      ))}
    </ItemPickerContainer>
  );
};

export default ItemPicker;

const ItemPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 150px;
  padding-top: 60px;
  gap: 10px;
  padding-bottom: 60px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  z-index: 10;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.div<{ $isSelected: boolean }>`
  flex: 0 0 auto;
  height: 60px;
  box-sizing: border-box;
  padding: 15px 0;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  scroll-snap-align: center;
  ${($isSelected) =>
    $isSelected ? theme.fonts.medium24 : theme.fonts.regular25};
  color: ${({ $isSelected }) => ($isSelected ? "white" : theme.colors.gray600)};
  transition: color 0.3s, border 0.3s;
  &:hover {
    cursor: pointer;
  }
`;
