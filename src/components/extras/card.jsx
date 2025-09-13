import { cn } from "../../libs/client/helpers";

/**
 * @typedef {"default" | "elevated" | "outlined" | "glass"} CardVariant
 * @typedef {"sm" | "md" | "lg"} CardSize
 */

/**
 * @typedef {Object} CardProps
 * @property {CardVariant} [variant] - The variant style for the card.
 * @property {CardSize} [size] - The size of the card.
 * @property {string} [className] - Additional className for custom styling.
 */

/**
 * @typedef {Object} CardHeaderProps
 * @property {string} [className] - Additional className for custom styling.
 */

/**
 * @typedef {Object} CardTitleProps
 * @property {string} [className] - Additional className for custom styling.
 * @property {"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p"} [as] - The HTML tag to render as a title.
 */

/**
 * @typedef {Object} CardContentProps
 * @property {string} [className] - Additional className for custom styling.
 */

/**
 * @typedef {Object} CardFooterProps
 * @property {string} [className] - Additional className for custom styling.
 */

/**
 * Card component
 * @param {CardProps} props
 * @returns {JSX.Element}
 */
function Card({ className, variant = "default", size = "md", ...props }) {
    const variants = {
        default:
            "bg-card border border-border dark:bg-gradient-to-r dark:from-primary/10 dark:to-background",
        elevated:
            "bg-card border-border shadow-lg shadow-gray-400/10 dark:shadow-black/50",
        outlined: "bg-background border-2 border-border",
        glass: "bg-background/80 dark:bg-card/30 border border-border/50 backdrop-blur-md",
    };

    const sizes = {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
    };

    return (
        <div
            className={cn(
                "flex flex-col transition-all duration-200",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

/**
 * CardHeader component
 * @param {CardHeaderProps} props
 * @returns {JSX.Element}
 */
function CardHeader({ className, ...props }) {
    return (
        <div
            className={cn(
                "flex flex-col space-y-1.5 p-4 border-b border-border",
                className
            )}
            {...props}
        />
    );
}

/**
 * CardTitle component
 * @param {CardTitleProps} props
 * @returns {JSX.Element}
 */
function CardTitle({ className, as = "h3", ...props }) {
    const Component = as;
    return (
        <Component
            className={cn(
                "text-lg font-semibold leading-none tracking-tight text-foreground",
                className
            )}
            {...props}
        />
    );
}

/**
 * CardContent component
 * @param {CardContentProps} props
 * @returns {JSX.Element}
 */
function CardContent({ className, ...props }) {
    return <div className={cn("p-4 flex-1", className)} {...props} />;
}

/**
 * CardFooter component
 * @param {CardFooterProps} props
 * @returns {JSX.Element}
 */
function CardFooter({ className, ...props }) {
    return (
        <div
            className={cn(
                "flex items-center p-4 border-t border-border",
                className
            )}
            {...props}
        />
    );
}

// Attach subcomponents to Card
Card.header = CardHeader;
Card.title = CardTitle;
Card.content = CardContent;
Card.footer = CardFooter;

export default Card;
