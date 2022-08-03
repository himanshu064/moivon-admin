import React from "react";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverFooter,
  ButtonGroup,
} from "@chakra-ui/react";

const ChangeEventStatusPopup = ({ children, onStatusChange }) => {
  const initialFocusRef = React.useRef();

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='bottom'
      closeOnBlur={false}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent color='black' borderColor='blue.100'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Change Event Status
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <ButtonGroup size='sm'>
            <Button
              colorScheme='red'
              onClick={() => onStatusChange("unpublish")}
            >
              Unpublish Event
            </Button>
            <Button
              colorScheme='green'
              onClick={() => onStatusChange("publish")}
              ref={initialFocusRef}
            >
              Publish Event
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default ChangeEventStatusPopup;
