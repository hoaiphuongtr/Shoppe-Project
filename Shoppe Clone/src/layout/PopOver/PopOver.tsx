import React, {
    type ElementType,
    ReactNode,
    useId,
    useRef,
    useState
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    offset,
    shift,
    flip,
    useFloating,
    autoUpdate,
    arrow,
    useTransitionStyles,
    Placement,
    FloatingPortal
} from '@floating-ui/react';

interface TooltipProps {
    placement?: Placement;
    children: ReactNode;
    content: React.ReactNode;
    className?: string;
    as?: ElementType;
    initialOpen?: boolean;
}

export default function PopOver({
    placement,
    children,
    content,
    as: ELement = 'div',
    initialOpen,
    className
}: TooltipProps) {
    const [isOpen, setIsOpen] = useState(initialOpen || false);
    const arrowRef = useRef<HTMLElement>(null);

    const { refs, floatingStyles, context, middlewareData } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        strategy: 'fixed',
        placement,
        middleware: [
            offset(6),
            flip(),
            shift(),
            arrow({
                element: arrowRef
            })
        ],
        whileElementsMounted: autoUpdate
    });
    const id = useId();

    const { styles: transitionStyles } = useTransitionStyles(context, {
        initial: {
            opacity: 0,
            transform: `${middlewareData.arrow?.x} px top`
        }
    });

    return (
        <ELement
            ref={refs.setReference}
            className={className}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {children}
            <FloatingPortal id={id}>
                <AnimatePresence>
                    {isOpen && (
                        <div
                            ref={refs.setFloating}
                            style={{ ...floatingStyles, zIndex: 1 }}
                        >
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    transform: 'scale(0)'
                                }}
                                animate={{
                                    opacity: 1,
                                    transform: 'scale(1)'
                                }}
                                exit={{ opacity: 0, transform: 'scale(0)' }}
                                transition={{ duration: 0.2 }}
                            >
                                <span
                                    ref={arrowRef}
                                    style={{
                                        left: middlewareData.arrow?.x,
                                        top: middlewareData.arrow?.y
                                    }}
                                    className='border-x-transparent border-t-transparent border-b-white border-[11px] absolute translate-y-[-95%] z-10'
                                ></span>
                                <div
                                    style={transitionStyles}
                                    className='bg-white relative shadow-md rounded-sm border border-gray-200'
                                >
                                    {content}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </ELement>
    );
}
