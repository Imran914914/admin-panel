// "use client"
// // import React, { memo} from 'react'
// // import { connect } from 'react-redux';
// // import { ThemeChanger } from '@/shared/redux/action';

// // function Layout({children, local_varaiable, ThemeChanger}:any) {
// //   const customstyles :any=
// //   {
// //     ...(local_varaiable.colorPrimaryRgb !== '' && { '--primary-rgb': local_varaiable.colorPrimaryRgb }),
// //     ...(local_varaiable.colorPrimary !== '' && { '--primary': local_varaiable.colorPrimary }),
// //     ...(local_varaiable.bodyBg1 !== '' && { '--body-bg-rgb': local_varaiable.bodyBg1 }),
// //     ...(local_varaiable.bodyBg2 !== '' && { '--body-bg-rgb2': local_varaiable.bodyBg2 }),
// //     ...(local_varaiable.Light !== '' && { '--light-rgb': local_varaiable.bodyBg2 }),
// //     ...(local_varaiable.Formcontrol !== '' && { '--form-control-bg': `rgb(${local_varaiable.bodyBg2})` }),
// //     ...(local_varaiable.inputBorder !== '' && { '--input-border': `rgb(${local_varaiable.inputBorder})` }),
// //     ...(local_varaiable.Graycolor !== '' && { '--gray-3': `rgb(${local_varaiable.Graycolor})` }),
// //   };


// //   return (
// //     <>
// //          <html
// //             suppressHydrationWarning={true} 
// //             dir={local_varaiable.dir}
// //             data-theme-mode={'dark'}
// //             data-header-styles={local_varaiable.dataHeaderStyles}
// //             data-vertical-style={local_varaiable.dataVerticalStyle}
// //             data-nav-layout={local_varaiable.dataNavLayout}
// //             data-menu-styles={local_varaiable.dataMenuStyles}
// //             data-toggled={local_varaiable.toggled}
// //             data-nav-style={local_varaiable.dataNavStyle}
// //             data-page-style={local_varaiable.dataPageStyle}
// //             data-width={local_varaiable.dataWidth}
// //             data-menu-position={local_varaiable.dataMenuPosition}
// //             data-header-position={local_varaiable.dataHeaderPosition}
// //             data-icon-overlay={local_varaiable.iconOverlay}
// //             data-bg-img={local_varaiable.bgImg}
// //             data-icon-text={local_varaiable.iconText}

// //             //Styles
// //             style={customstyles}>
// //               <head>
// //               <meta name="keywords" content="Xtreme Fish Admin panel" />
// //               </head>
// //              <body className={`${local_varaiable.body ? local_varaiable.body : ''}`}>
// //               {children}
// //              </body>
// //           </html>
// //     </>
// //   )
// // }

// // const mapStateToProps = (state: any) => ({
// //   local_varaiable: state
// // });

// // export default memo(connect(mapStateToProps, {ThemeChanger})(Layout));

// "use client";
// import React, { memo } from "react";
// import { useDispatch, useSelector } from "react-redux"; // Using hooks instead of connect
// import { ThemeChanger } from "@/shared/redux/action";

// interface LocalVariable {
//   colorPrimaryRgb: string;
//   colorPrimary: string;
//   bodyBg1: string;
//   bodyBg2: string;
//   Light: string;
//   Formcontrol: string;
//   inputBorder: string;
//   Graycolor: string;
//   dir: string;
//   dataHeaderStyles: string;
//   dataVerticalStyle: string;
//   dataNavLayout: string;
//   dataMenuStyles: string;
//   toggled: string;
//   dataNavStyle: string;
//   dataPageStyle: string;
//   dataWidth: string;
//   dataMenuPosition: string;
//   dataHeaderPosition: string;
//   iconOverlay: string;
//   bgImg: string;
//   iconText: string;
//   body: string;
// }

// // Define the type for the component props
// interface LayoutProps {
//   children: React.ReactNode;
//   local_varaiable: LocalVariable;
// }
// const Layout = ({ children }: LayoutProps) => {
//   // Use Redux hooks instead of `connect`
//   const local_varaiable = useSelector((state: any) => state.theme); // Adjust the selector based on your state shape
//   console.log("local_variable in here:    ",local_varaiable);
//   const dispatch = useDispatch();

//   const customstyles: any = {
//     ...(local_varaiable.colorPrimaryRgb !== "" && {
//       "--primary-rgb": local_varaiable.colorPrimaryRgb,
//     }),
//     ...(local_varaiable.colorPrimary !== "" && {
//       "--primary": local_varaiable.colorPrimary,
//     }),
//     ...(local_varaiable.bodyBg1 !== "" && {
//       "--body-bg-rgb": local_varaiable.bodyBg1,
//     }),
//     ...(local_varaiable.bodyBg2 !== "" && {
//       "--body-bg-rgb2": local_varaiable.bodyBg2,
//     }),
//     ...(local_varaiable.Light !== "" && {
//       "--light-rgb": local_varaiable.bodyBg2,
//     }),
//     ...(local_varaiable.Formcontrol !== "" && {
//       "--form-control-bg": `rgb(${local_varaiable.bodyBg2})`,
//     }),
//     ...(local_varaiable.inputBorder !== "" && {
//       "--input-border": `rgb(${local_varaiable.inputBorder})`,
//     }),
//     ...(local_varaiable.Graycolor !== "" && {
//       "--gray-3": `rgb(${local_varaiable.Graycolor})`,
//     }),
//   };


//   return (
//     <>
//       <div
//         suppressHydrationWarning={true}
//         dir={local_varaiable.dir}
//         data-theme-mode={"dark"}
//         data-header-styles={local_varaiable.dataHeaderStyles}
//         data-vertical-style={local_varaiable.dataVerticalStyle}
//         data-nav-layout={local_varaiable.dataNavLayout}
//         data-menu-styles={local_varaiable.dataMenuStyles}
//         data-toggled={local_varaiable.toggled}
//         data-nav-style={local_varaiable.dataNavStyle}
//         data-page-style={local_varaiable.dataPageStyle}
//         data-width={local_varaiable.dataWidth}
//         data-menu-position={local_varaiable.dataMenuPosition}
//         data-header-position={local_varaiable.dataHeaderPosition}
//         data-icon-overlay={local_varaiable.iconOverlay}
//         data-bg-img={local_varaiable.bgImg}
//         data-icon-text={local_varaiable.iconText}
//         style={customstyles}
//       >
//         <head>
//           <meta name="keywords" content="Xtreme Fish Admin panel" />
//         </head>
//         <body className={local_varaiable.dataThemeMode}>
//           {children}
//         </body>
//       </div>
//     </>
//   );
// };

// export default memo(Layout);
"use client";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeChanger } from "@/shared/redux/action";

// Typing Props
type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  // Redux hooks
  const local_varaiable = useSelector((state: any) => state); // Get Redux state
  const dispatch = useDispatch();

  // Debugging state (remove this after testing)

  // Dynamic styles
  const customstyles: any = {
    ...(local_varaiable.colorPrimaryRgb && {
      "--primary-rgb": local_varaiable.colorPrimaryRgb,
    }),
    ...(local_varaiable.colorPrimary && {
      "--primary": local_varaiable.colorPrimary,
    }),
    ...(local_varaiable.bodyBg1 && {
      "--body-bg-rgb": local_varaiable.bodyBg1,
    }),
    ...(local_varaiable.bodyBg2 && {
      "--body-bg-rgb2": local_varaiable.bodyBg2,
    }),
    ...(local_varaiable.Light && {
      "--light-rgb": local_varaiable.bodyBg2,
    }),
    ...(local_varaiable.Formcontrol && {
      "--form-control-bg": `rgb(${local_varaiable.bodyBg2})`,
    }),
    ...(local_varaiable.inputBorder && {
      "--input-border": `rgb(${local_varaiable.inputBorder})`,
    }),
    ...(local_varaiable.Graycolor && {
      "--gray-3": `rgb(${local_varaiable.Graycolor})`,
    }),
  };

  return (
    <html
      suppressHydrationWarning={true}
      dir={local_varaiable.dir || "ltr"}
      data-theme-mode={local_varaiable.dataThemeMode || "dark"} // Fixed Theme Mode
      data-header-styles={local_varaiable.dataHeaderStyles || "default"}
      data-vertical-style={local_varaiable.dataVerticalStyle || "default"}
      data-nav-layout={local_varaiable.dataNavLayout || "default"}
      data-menu-styles={local_varaiable.dataMenuStyles || "default"}
      data-toggled={local_varaiable.toggled || "false"}
      data-nav-style={local_varaiable.dataNavStyle || "default"}
      data-page-style={local_varaiable.dataPageStyle || "default"}
      data-width={local_varaiable.dataWidth || "full"}
      data-menu-position={local_varaiable.dataMenuPosition || "fixed"}
      data-header-position={local_varaiable.dataHeaderPosition || "fixed"}
      data-icon-overlay={local_varaiable.iconOverlay || "false"}
      data-bg-img={local_varaiable.bgImg || "none"}
      data-icon-text={local_varaiable.iconText || "false"}
      style={customstyles} // Apply custom styles
    >
      <head>
        <meta name="keywords" content="Xtreme Fish Admin panel" />
      </head>
      <body className={local_varaiable.body || ""}>
        {children}
      </body>
    </html>
  );
};

export default memo(Layout);
