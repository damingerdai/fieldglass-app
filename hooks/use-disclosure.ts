import { useCallback, useState } from 'react';
import { useCallbackRef } from './use-callback-ref';

export interface UseDisclosureProps {
    isOpen?: boolean;
    onOpen?(): void;
    onClose?(): void;
    isDefaultOpen?: boolean;
}

export function useDisclosure(props: UseDisclosureProps = {}) {
    const {
        onOpen: onOpenProp,
        onClose: onCloseProp,
        isOpen: isOpenProp,
        isDefaultOpen: isDefaultOpenProps
    } = props;

    const handleOpen = useCallbackRef(onOpenProp);
    const handleClose = useCallbackRef(onCloseProp);

    const [isOpenState, setIsOpen] = useState(isDefaultOpenProps || false);

    const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;

    const isControlled = isOpenProp !== undefined;

    const onClose = useCallback(() => {
        if (!isControlled) {
            setIsOpen(false);
        }
        if (handleClose) {
            handleClose();
        }
    }, [isControlled, handleClose]);

    const onOpen = useCallback(() => {
        if (!isControlled) {
            setIsOpen(true);
        }
        if (handleOpen) {
            handleOpen();
        }
    }, [isControlled, handleOpen]);

    const onToggle = useCallback(() => {
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    }, [isOpen, onOpen, onClose]);

    return {
        isOpen,
        onOpen,
        onClose,
        onToggle,
        isControlled
    };
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;