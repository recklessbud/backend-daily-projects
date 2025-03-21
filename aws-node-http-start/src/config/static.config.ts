import path from "path";
export const getStaticFile = () => {
if(process.env._LAMBDA_TASK_ROOT) {
    return path.join(process.env.LAMBDA_TASK_ROOT as string, 'src/public');
}

return path.join(__dirname, 'public');
}